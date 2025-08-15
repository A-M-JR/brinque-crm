import { NextResponse } from "next/server";
import { mpPreapproval } from "@/lib/mercadopago/server";
import { registrarAssinatura } from "@/lib/supabase/subscriptions";
import { toSubscriptionStatus } from "@/lib/utils/mercadopago";

export async function POST(req: Request) {
  try {
    const { userId, planName, amount_cents, customerEmail } = await req.json();

    const pre = await mpPreapproval.create({
      body: {
        reason: planName,
        payer_email: customerEmail,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: amount_cents / 100,
          currency_id: "BRL",
        },
        back_url: `${process.env.APP_URL}/loja/checkout?sub=ok`,
      },
    });

    const saved = await registrarAssinatura({
      user_id: userId ?? null,
      plan_name: planName,
      amount_cents,
      currency: "BRL",
      mp_preapproval_id: pre.id ?? null,
      status: toSubscriptionStatus(pre.status),
      raw: pre,
    });

    return NextResponse.json({ preapproval: pre, subscription: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
