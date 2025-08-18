import { NextResponse } from "next/server";
import { logWebhook } from "@/lib/supabase/webhooks";
import { atualizarStatusPedido } from "@/lib/supabase/orders";
import { atualizarStatusPagamentoByMpId, buscarPedidoPorPagamentoMpId } from "@/lib/supabase/payments";
import { atualizarStatusAssinatura } from "@/lib/supabase/subscriptions";
import { mpPayment, mpPreapproval } from "@/lib/mercadopago/server";
import { toSubscriptionStatus } from "@/lib/utils/mercadopago";

export async function POST(req: Request) {
  const headersObj: Record<string, string> = {};
  req.headers.forEach((v, k) => (headersObj[k] = v));
  const body = await req.json().catch(() => ({}));

  await logWebhook({
    source: "mercado_pago",
    topic: body?.type ?? headersObj["x-topic"] ?? null,
    external_id: body?.data?.id ?? null,
    headers: headersObj,
    body,
    verified: false,
  });

  try {
    const topic = body?.type ?? headersObj["x-topic"];

    if (topic?.includes("payment")) {
      const id = body?.data?.id ?? body?.id;
      if (id) {
        const detail = await mpPayment.get({ id: String(id) });
        const status = detail.status ?? null;

        await atualizarStatusPagamentoByMpId(String(id), status as any, detail);

        const order = await buscarPedidoPorPagamentoMpId(String(id));
        if (order && status === "approved") {
          await atualizarStatusPedido(order.id, "paid");
        }
      }
    }

    if (topic?.includes("preapproval")) {
      const id = body?.data?.id ?? body?.id;
      if (id) {
        const detail = await mpPreapproval.get({ id: String(id) });
        await atualizarStatusAssinatura(String(id), toSubscriptionStatus(detail.status), detail);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await logWebhook({ source: "mercado_pago", topic: "error", body: { error: e.message } });
    return NextResponse.json({ ok: true });
  }
}
