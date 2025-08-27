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
    
    // 👇 ALTERAÇÃO AQUI: Campos movidos para fora do 'config'
    primary_color: string | null;
    secondary_color: string | null;
    instagram_user: string | null;
    whatsapp_number: string | null;
    
    config: {} | null; // 'config' pode ser mantido para futuras configurações
    created_at: string;
    franchise?: { name: string };
};

export type StoreItem = {
    id: number;
    store_id: number;
    product_id: number;
    product: Product;
};

// --- Funções CRUD para Lojas (Nenhuma alteração na lógica, apenas se beneficiam da tipagem correta) ---

export async function listarLojas(): Promise<Store[]> {
    const { data, error } = await supabase
        .from('crm_stores')
        .select('*, franchise:crm_franchises(name)');

    if (error) {
        console.error("Erro ao listar lojas:", error);
        throw error;
    }
    return data as Store[];
}

export async function buscarLojaPorId(id: number): Promise<Store | null> {
    const { data, error } = await supabase
        .from('crm_stores')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Erro ao buscar loja por ID:", error);
        throw error;
    }
    return data;
}

export async function salvarLoja(storeData: Partial<Store>, id?: number): Promise<Store> {
    let query;
    if (id) {
        query = supabase.from('crm_stores').update(storeData).eq('id', id);
    } else {
        query = supabase.from('crm_stores').insert(storeData);
    }

    const { data, error } = await query.select().single();

    if (error) {
        console.error("Erro ao salvar loja:", error);
        throw error;
    }
    return data;
}

export async function deletarLoja(id: number): Promise<void> {
    const { error } = await supabase
        .from('crm_stores')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Erro ao deletar loja:", error);
    }
}

// --- Funções para Itens da Loja (Sem alterações) ---

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

export async function addStoreItem(storeId: number, productId: number): Promise<any> {
    const { data, error } = await supabase
        .from('crm_stores_itens')
        .insert({ store_id: storeId, product_id: productId });
    if (error) { throw error; }
    return data;
}

export async function removeStoreItem(storeId: number, productId: number): Promise<any> {
    const { error } = await supabase
        .from('crm_stores_itens')
        .delete()
        .eq('store_id', storeId)
        .eq('product_id', productId);
    if (error) { throw error; }
    return { success: true };
}