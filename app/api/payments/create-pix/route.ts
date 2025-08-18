import { NextResponse } from "next/server";
import { mpPayment } from "@/lib/mercadopago/server";
import { buscarPedidoPorId } from "@/lib/supabase/orders";
import { registrarPagamento } from "@/lib/supabase/payments";

export async function POST(req: Request) {
  try {
    const { orderId, customerEmail } = await req.json();

    const order = await buscarPedidoPorId(orderId);
    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

    const pix = await mpPayment.create({
      body: {
        transaction_amount: order.amount_cents / 100,
        description: `Pedido ${orderId}`,
        payment_method_id: "pix",
        payer: { email: customerEmail ?? order.customer_email ?? undefined },
      },
    });

    await registrarPagamento({
      order_id: orderId,
      mp_payment_id: String(pix.id),
      method: "pix",
      status: pix.status as any,
      raw: pix,
    });

    return NextResponse.json({
      id: pix.id,
      status: pix.status,
      qr_base64: pix.point_of_interaction?.transaction_data?.qr_code_base64,
      qr_code: pix.point_of_interaction?.transaction_data?.qr_code,
      expires_at: (pix as any).date_of_expiration,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro" }, { status: 500 });
  }
}
