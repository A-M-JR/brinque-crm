import { supabase } from "./client";
import { Product } from "./products";

// --- Tipagens ---

export type Store = {
    id: number;
    franchise_id: number;
    name: string;
    slug: string;
    logo_url: string | null;
    banner_url: string | null;
    description: string | null;
    is_active: boolean;
    config: {
        primaryColor?: string;
        secondaryColor?: string;
        instagram?: string;
        facebook?: string;
        whatsapp?: string;
    } | null;
    created_at: string;
};

export type StoreItem = {
    id: number;
    store_id: number;
    product_id: number;
    product: Product; // Incluímos o objeto do produto para facilitar o uso no frontend
};

// --- Funções para Lojas (crm_stores) ---

/**
 * Busca a loja de uma franquia. Como a relação é 1-para-1,
 * esperamos no máximo um resultado.
 */
export async function getStoreByFranchiseId(franchiseId: number): Promise<Store | null> {
    const { data, error } = await supabase
        .from('crm_stores')
        .select('*')
        .eq('franchise_id', franchiseId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = "A consulta não retornou nenhuma linha"
        console.error("Erro ao buscar loja:", error);
        throw error;
    }

    return data;
}

/**
 * Cria ou atualiza os dados de uma loja.
 * O comando 'upsert' é perfeito para isso.
 */
export async function upsertStore(storeData: Partial<Store>): Promise<Store> {
    const { data, error } = await supabase
        .from('crm_stores')
        .upsert(storeData, { onConflict: 'franchise_id' })
        .select()
        .single();

    if (error) {
        console.error("Erro ao salvar dados da loja:", error);
        throw error;
    }

    return data;
}

// --- Funções para Itens da Loja (crm_stores_itens) ---

/**
 * Lista todos os produtos que estão na vitrine de uma loja.
 */
export async function getStoreItems(storeId: number): Promise<StoreItem[]> {
    const { data, error } = await supabase
        .from('crm_stores_itens')
        .select('*, product:crm_products(*, category:crm_categories(name))')
        .eq('store_id', storeId);

    if (error) {
        console.error("Erro ao listar itens da loja:", error);
        throw error;
    }

    return data as unknown as StoreItem[];
}

/**
 * Adiciona um produto à vitrine da loja.
 */
export async function addStoreItem(storeId: number, productId: number): Promise<any> {
    const { data, error } = await supabase
        .from('crm_stores_itens')
        .insert({ store_id: storeId, product_id: productId });

    if (error) {
        console.error("Erro ao adicionar item na loja:", error);
        throw error;
    }

    return data;
}

/**
 * Remove um produto da vitrine da loja.
 */
export async function removeStoreItem(storeId: number, productId: number): Promise<any> {
    const { error } = await supabase
        .from('crm_stores_itens')
        .delete()
        .eq('store_id', storeId)
        .eq('product_id', productId);

    if (error) {
        console.error("Erro ao remover item da loja:", error);
        throw error;
    }

    return { success: true };
}