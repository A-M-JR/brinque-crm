import { NextResponse } from "next/server";
import { mpPreference } from "@/lib/mercadopago/server";
import { buscarPedidoPorId } from "@/lib/supabase/orders";

export async function POST(req: Request) {
  const { orderId, title, quantity } = await req.json();

  const order = await buscarPedidoPorId(orderId);
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

  const pref = await mpPreference.create({
    body: {
      items: [{
        id: orderId,
        title: title ?? "Pedido",
        quantity: quantity ?? 1,
        unit_price: order.amount_cents / 100,
      }],
      back_urls: {
        success: `${process.env.APP_URL}/loja/checkout?status=success`,
        failure: `${process.env.APP_URL}/loja/checkout?status=failure`,
        pending: `${process.env.APP_URL}/loja/checkout?status=pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
    },
  });

  return NextResponse.json({ id: pref.id });
}
