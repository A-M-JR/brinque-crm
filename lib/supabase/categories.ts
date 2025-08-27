import { supabase } from "./client";

// --- Tipagem ---
export type Category = {
    id: number;
    created_at: string;
    name: string;
    description: string | null;
    franchise_id: number;
    status: boolean;
};

/**
 * Lista todas as categorias de uma franquia específica.
 */
export async function listarCategoriasPorFranchise(franchiseId: number): Promise<Category[]> {
    const { data, error } = await supabase
        .from("crm_categories")
        .select("*")
        .eq("franchise_id", franchiseId)
        .order("name");

    if (error) {
        console.error("Erro ao listar categorias:", error);
        throw error;
    }
    return data || [];
}

/**
 * Busca uma categoria específica pelo seu ID.
 */
export async function buscarCategoriaPorId(id: number): Promise<Category | null> {
    const { data, error } = await supabase
        .from("crm_categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao buscar categoria:", error);
        throw error;
    }
    return data;
}

/**
 * Cria uma nova categoria.
 */
export async function criarCategoria(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const { data, error } = await supabase
        .from("crm_categories")
        .insert([categoryData])
        .select()
        .single();

    if (error) {
        console.error("Erro ao criar categoria:", error);
        throw error;
    }
    return data;
}

/**
 * Atualiza os dados de uma categoria existente.
 */
export async function atualizarCategoria(id: number, updates: Partial<Omit<Category, 'id' | 'created_at' | 'franchise_id'>>): Promise<Category> {
    const { data, error } = await supabase
        .from("crm_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Erro ao atualizar categoria:", error);
        throw error;
    }
    return data;
}

/**
 * Deleta uma categoria pelo seu ID.
 */
export async function deletarCategoria(id: number): Promise<void> {
    const { error } = await supabase
        .from("crm_categories")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao deletar categoria:", error);
        throw error;
    }
}