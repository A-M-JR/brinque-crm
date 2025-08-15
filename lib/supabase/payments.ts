import { supabase } from "./client";
import type { Order } from "./orders";

export type PaymentStatus =
  | "approved" | "authorized" | "in_process" | "in_mediation"
  | "rejected" | "cancelled" | "refunded" | "charged_back" | "pending" | null;

export type Payment = {
  id: string;               // uuid
  order_id: string;         // crm_orders.id (uuid)
  mp_payment_id: string | null;
  method: "card" | "pix" | "wallet";
  status: PaymentStatus;
  raw: any | null;
  created_at: string;
};

export async function registrarPagamento(input: {
  order_id: string;
  mp_payment_id?: string | null;
  method: Payment["method"];
  status?: PaymentStatus;
  raw?: any;
}): Promise<Payment> {
  const { data, error } = await supabase
    .from("crm_payments")
    .insert([{
      order_id: input.order_id,
      mp_payment_id: input.mp_payment_id ?? null,
      method: input.method,
      status: input.status ?? null,
      raw: input.raw ?? null,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function atualizarStatusPagamentoByMpId(mp_payment_id: string, status: PaymentStatus, raw?: any) {
  const { data, error } = await supabase
    .from("crm_payments")
    .update({ status, raw: raw ?? null })
    .eq("mp_payment_id", mp_payment_id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Payment | null;
}

export async function buscarPagamentoPorMpId(mp_payment_id: string) {
  const { data, error } = await supabase
    .from("crm_payments")
    .select("*")
    .eq("mp_payment_id", mp_payment_id)
    .maybeSingle();

  if (error) throw error;
  return data as Payment | null;
}

export async function buscarPedidoPorPagamentoMpId(mp_payment_id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("crm_payments")
    .select("order:crm_orders(*)")
    .eq("mp_payment_id", mp_payment_id)
    .maybeSingle();

  if (error) throw error;
  return (data?.order ?? null) as Order | null;
}
