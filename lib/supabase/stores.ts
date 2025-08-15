import { supabase } from "./client";

export type Store = {
  id: string;
  franchise_id: number | null;
  owner_user_id: string | null;
  name: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  theme: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  domains: any | null;   // { primary, customs[] }
  settings: any | null;  // JSON com configs
  created_at: string;
};

export type StoreProduct = {
  store_id: string;
  product_id: number;
  show: boolean;
  sort_order: number;
  price_override_cents: number | null;
  created_at: string;
};

/** CRUD LOJAS */
export async function listarLojas(params?: { franchise_id?: number; owner_user_id?: string }) {
  let q = supabase.from("crm_stores").select("*").order("created_at", { ascending: false });
  if (params?.franchise_id != null) q = q.eq("franchise_id", params.franchise_id);
  if (params?.owner_user_id) q = q.eq("owner_user_id", params.owner_user_id);
  const { data, error } = await q;
  if (error) throw error;
  return data as Store[];
}

export async function buscarLojaPorId(id: string) {
  const { data, error } = await supabase.from("crm_stores").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Store;
}

export async function buscarLojaPorSlug(slug: string) {
  const { data, error } = await supabase.from("crm_stores").select("*").eq("slug", slug).single();
  if (error) throw error;
  return data as Store;
}

export async function criarLoja(input: {
  name: string;
  slug: string;
  description?: string | null;
  franchise_id?: number | null;
  owner_user_id?: string | null;
  theme?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  domains?: any | null;
  settings?: any | null;
  is_active?: boolean;
}) {
  const { data, error } = await supabase
    .from("crm_stores")
    .insert([{
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      franchise_id: input.franchise_id ?? null,
      owner_user_id: input.owner_user_id ?? null,
      theme: input.theme ?? null,
      logo_url: input.logo_url ?? null,
      favicon_url: input.favicon_url ?? null,
      domains: input.domains ?? null,
      settings: input.settings ?? null,
      is_active: input.is_active ?? true,
    }])
    .select()
    .single();
  if (error) throw error;
  return data as Store;
}

export async function atualizarLoja(id: string, updates: Partial<Omit<Store, "id" | "created_at">>) {
  const { data, error } = await supabase
    .from("crm_stores")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Store;
}

export async function excluirLoja(id: string) {
  const { error } = await supabase.from("crm_stores").delete().eq("id", id);
  if (error) throw error;
}

/** VÍNCULO LOJA x PRODUTOS */
export async function listarProdutosDaLoja(store_id: string) {
  const { data, error } = await supabase
    .from("crm_store_products")
    .select("*, product:crm_products(id, name, price, show_on_store)")
    .eq("store_id", store_id)
    .order("sort_order");
  if (error) throw error;
  return data as (StoreProduct & { product: any })[];
}

export async function upsertProdutosDaLoja(store_id: string, items: Array<{
  product_id: number;
  show?: boolean;
  sort_order?: number;
  price_override_cents?: number | null;
}>) {
  const rows = items.map(i => ({
    store_id,
    product_id: i.product_id,
    show: i.show ?? true,
    sort_order: i.sort_order ?? 0,
    price_override_cents: i.price_override_cents ?? null,
  }));
  const { data, error } = await supabase
    .from("crm_store_products")
    .upsert(rows, { onConflict: "store_id,product_id" })
    .select();
  if (error) throw error;
  return data as StoreProduct[];
}

export async function removerProdutoDaLoja(store_id: string, product_id: number) {
  const { error } = await supabase
    .from("crm_store_products")
    .delete()
    .match({ store_id, product_id });
  if (error) throw error;
}
