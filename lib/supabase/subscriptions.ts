// src/lib/supabase/subscriptions.ts
import { supabase } from "./client";

// Status padronizado do módulo
export type SubscriptionStatus =
  | "authorized"
  | "paused"
  | "cancelled"
  | "expired"
  | "finished"
  | null;

// Assinatura (snapshot do plano salvo em plan_name e amount_cents)
export type Subscription = {
  id: number;                 // bigint identity
  created_at: string;

  franchise_id: number;
  subscription_plan_id: number;
  user_id: number | null;

  // Vínculo com cliente/empresa (para o fluxo pelo cadastro do cliente)
  company_id: number | null;

  // Snapshot do plano no momento da criação/edição
  plan_name: string;
  amount_cents: number;       // sempre em centavos
  currency: string;           // ex.: 'BRL'

  mp_preapproval_id: string | null;
  status: SubscriptionStatus;
  raw: any | null;
};

// Plano de assinatura
export type SubscriptionPlan = {
  id: number;
  franchise_id: number;
  name: string;

  // IMPORTANTE: aqui consideramos default_price em reais (padrão americano, 1234.56).
  // Se no seu schema estiver em centavos, troque para default_price_cents: number e ajuste o front.
  default_price: number;

  billing_cycle?: string | null;
  status: boolean;
  created_at?: string | null;
};

/**
 * LISTAGEM GERAL (menu "Assinaturas")
 * Aceita filtros por franquia, status, plano, busca textual, paginação.
 */
export async function getSubscriptions(params?: {
  franchise_id?: number;
  q?: string;
  status?: Exclude<SubscriptionStatus, null>;
  plan_id?: number;
  company_id?: number; // extra: permite filtrar por cliente aqui também, se quiser
  limit?: number;
  offset?: number;
}): Promise<Subscription[]> {
  let query = supabase
    .from("crm_subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.franchise_id != null) {
    query = query.eq("franchise_id", params.franchise_id);
  }
  if (params?.status) {
    query = query.eq("status", params.status);
  }
  if (params?.plan_id) {
    query = query.eq("subscription_plan_id", params.plan_id);
  }
  if (params?.company_id) {
    query = query.eq("company_id", params.company_id);
  }

  // paginação
  if (typeof params?.offset === "number" || typeof params?.limit === "number") {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 50;
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;

  let list = (data || []) as Subscription[];

  // busca textual no client-side (caso queira expandir, mova para RPC/SQL)
  const q = params?.q?.trim().toLowerCase();
  if (q) {
    list = list.filter((r) =>
      [r.plan_name, String(r.user_id ?? ""), String(r.subscription_plan_id), String(r.company_id ?? "")]
        .some((s) => s.toLowerCase().includes(q))
    );
  }
  return list;
}

/**
 * BUSCAR POR ID
 */
export async function getSubscriptionById(id: number): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from("crm_subscriptions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as Subscription) ?? null;
}

/**
 * UPSERT (create/update) genérico
 * - Use no menu geral de Assinaturas
 * - Também pode ser reaproveitado pelo fluxo do Cliente
 */
export async function upsertSubscription(input: {
  id?: number;

  franchise_id: number;
  subscription_plan_id: number;

  user_id?: number | null;
  company_id?: number | null; // permita informar no fluxo do cliente

  // snapshot
  plan_name: string;
  amount_cents: number;
  currency?: string;

  mp_preapproval_id?: string | null;
  status?: Exclude<SubscriptionStatus, null>;
  raw?: any | null;
}): Promise<number> {
  const payload = {
    franchise_id: input.franchise_id,
    subscription_plan_id: input.subscription_plan_id,

    user_id: input.user_id ?? null,
    company_id: input.company_id ?? null,

    plan_name: input.plan_name,
    amount_cents: input.amount_cents,
    currency: input.currency ?? "BRL",

    mp_preapproval_id: input.mp_preapproval_id ?? null,
    status: input.status ?? "authorized",
    raw: input.raw ?? null,
  };

  if (input.id) {
    const { error } = await supabase
      .from("crm_subscriptions")
      .update(payload)
      .eq("id", input.id);
    if (error) throw error;
    return input.id;
  } else {
    const { data, error } = await supabase
      .from("crm_subscriptions")
      .insert([payload])
      .select("id")
      .single();
    if (error) throw error;
    return data?.id as number;
  }
}

/**
 * DELETE
 */
export async function deleteSubscription(id: number) {
  const { error } = await supabase.from("crm_subscriptions").delete().eq("id", id);
  if (error) throw error;
}

/**
 * HELPERS ESPECÍFICOS DO FLUXO POR CLIENTE (Company)
 */

// Lista assinaturas de um cliente (aba "Assinaturas" dentro do cadastro)
export async function listarAssinaturasPorCliente(company_id: number) {
  const { data, error } = await supabase
    .from("crm_subscriptions")
    .select("*")
    .eq("company_id", company_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listarAssinaturasPorCliente error:", error);
    throw error;
  }
  console.log("listarAssinaturasPorCliente data:", data);
  return (data ?? []) as Subscription[];
}

// Atalho para criar assinatura já vinculada ao cliente (company_id)
// Use este atalho no ClienteForm
export async function criarAssinatura(input: {
  franchise_id: number;
  subscription_plan_id: number;
  company_id: number;         // obrigatório no fluxo do cliente
  user_id?: number | null;    // se quiser atrelar também
  plan_name: string;
  amount_cents: number;
  currency?: string; // BRL por padrão
  status?: Exclude<SubscriptionStatus, null>; // authorized por padrão
  mp_preapproval_id?: string | null;
  raw?: any | null;
}): Promise<number> {
  return upsertSubscription({
    franchise_id: input.franchise_id,
    subscription_plan_id: input.subscription_plan_id,
    company_id: input.company_id,
    user_id: input.user_id ?? null,
    plan_name: input.plan_name,
    amount_cents: input.amount_cents,
    currency: input.currency ?? "BRL",
    status: input.status ?? "authorized",
    mp_preapproval_id: input.mp_preapproval_id ?? null,
    raw: input.raw ?? null,
  });
}

/**
 * PLANOS (para telas de cadastro/edição de planos e para popular o Select no ClienteForm)
 */
export async function listarPlanosPorFranchise(franchise_id: number) {
  const { data, error } = await supabase
    .from("crm_subscription_plans")
    .select("id, franchise_id, name, default_price, billing_cycle, status, created_at")
    .eq("franchise_id", franchise_id)
    .eq("status", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("listarPlanosPorFranchise error:", error);
    throw error;
  }
  console.log("listarPlanosPorFranchise data:", data);
  return (data ?? []) as SubscriptionPlan[];
}