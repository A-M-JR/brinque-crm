import { NextResponse } from "next/server";
import { mpPayment } from "@/lib/mercadopago/server";
import { buscarPedidoPorId, atualizarStatusPedido } from "@/lib/supabase/orders";
import { registrarPagamento } from "@/lib/supabase/payments";

export async function POST(req: Request) {
  try {
    const { orderId, token, installments, payer } = await req.json();

    const order = await buscarPedidoPorId(orderId);
    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

    const payment = await mpPayment.create({
      body: {
        transaction_amount: order.amount_cents / 100,
        token,
        description: `Pedido ${orderId}`,
        installments: installments ?? 1,
        payer,
      },
    });

    const mpId = String(payment.id);
    const status = payment.status as any;

    await registrarPagamento({
      order_id: orderId,
      mp_payment_id: mpId,
      method: "card",
      status,
      raw: payment,
    });

    if (status === "approved") await atualizarStatusPedido(orderId, "paid");

    return NextResponse.json({ ok: true, payment });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro" }, { status: 500 });
  }
}
