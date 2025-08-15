import { supabase } from "./client";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "canceled";

export type Order = {
  id: string; // uuid
  user_id: string | null;
  customer_email: string | null;
  amount_cents: number;
  currency: string; // 'BRL'
  status: OrderStatus;
  gateway: "mercado_pago";
  created_at: string;
};

export async function criarPedido(input: {
  user_id?: string | null;
  customer_email?: string | null;
  amount_cents: number;
  currency?: string;
}): Promise<Order> {
  const { data, error } = await supabase
    .from("crm_orders")
    .insert([{
      user_id: input.user_id ?? null,
      customer_email: input.customer_email ?? null,
      amount_cents: input.amount_cents,
      currency: input.currency ?? "BRL",
      status: "pending",
      gateway: "mercado_pago",
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function buscarPedidoPorId(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("crm_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) throw error;
  return data as Order;
}

export async function atualizarStatusPedido(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase
    .from("crm_orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}
