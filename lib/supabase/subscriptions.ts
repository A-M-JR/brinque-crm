import { supabase } from "./client";

export type SubscriptionStatus = "authorized" | "paused" | "cancelled" | "expired" | "finished" | null;

export type Subscription = {
  id: string;                 // uuid
  user_id: string | null;
  plan_name: string;
  amount_cents: number;
  currency: string;           // 'BRL'
  mp_preapproval_id: string | null;
  status: SubscriptionStatus | null;
  raw: any | null;
  created_at: string;
};

export async function registrarAssinatura(input: {
  user_id?: string | null;
  plan_name: string;
  amount_cents: number;
  currency?: string;
  mp_preapproval_id?: string | null;
  status?: SubscriptionStatus | null;
  raw?: any;
}) {
  const { data, error } = await supabase
    .from("crm_subscriptions")
    .insert([{
      user_id: input.user_id ?? null,
      plan_name: input.plan_name,
      amount_cents: input.amount_cents,
      currency: input.currency ?? "BRL",
      mp_preapproval_id: input.mp_preapproval_id ?? null,
      status: input.status ?? null,
      raw: input.raw ?? null,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

export async function atualizarStatusAssinatura(mp_preapproval_id: string, status: SubscriptionStatus, raw?: any) {
  const { data, error } = await supabase
    .from("crm_subscriptions")
    .update({ status, raw: raw ?? null })
    .eq("mp_preapproval_id", mp_preapproval_id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Subscription | null;
}
