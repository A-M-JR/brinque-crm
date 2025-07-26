import { supabase } from "./client"

// --- Tipagem atualizada para incluir a hierarquia ---
export type Franchise = {
    id: number;
    name: string;
    cnpj: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
    status: boolean;
    modules_enabled: Record<string, any>; // JSONB
    settings: Record<string, any>; // JSONB
    created_at: string;
    created_by: number | null;
    modified_at: string | null;
    modified_by: number | null;
    id_franchise_responsible: number | null; // Nova coluna
}

// --- Funções CRUD para Franchises ---

/**
 * Lista as franchises (empresas) que um utilizador pode ver.
 * - Super admin (franchiseId 1) vê todas.
 * - Outros utilizadores veem a sua própria empresa e as suas filhas.
 * @param userFranchiseId O ID da franchise do utilizador logado.
 */
export async function listarFranchisesVisiveis(userFranchiseId: number): Promise<Franchise[]> {
    let query = supabase.from("crm_franchises").select("*");

    // Se não for super admin, filtra pela própria empresa e pelas suas filhas
    if (userFranchiseId !== 1) {
        query = query.or(`id.eq.${userFranchiseId},id_franchise_responsible.eq.${userFranchiseId}`);
    }

    const { data, error } = await query.order("name");

    if (error) {
        console.error("Erro ao listar franchises visíveis:", error);
        throw error;
    }
    return data as Franchise[];
}

/**
 * Busca uma franchise específica pelo seu ID.
 */
export async function buscarFranchisePorId(id: number): Promise<Franchise | null> {
    const { data, error } = await supabase
        .from("crm_franchises")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Erro ao buscar franchise com ID ${id}:`, error);
        throw error;
    }
    return data as Franchise;
}

/**
 * Cria uma nova franchise no banco de dados.
 */
export async function criarFranchise(franchiseData: Partial<Omit<Franchise, 'id' | 'created_at'>>): Promise<Franchise> {
    const { data, error } = await supabase
        .from("crm_franchises")
        .insert([franchiseData])
        .select()
        .single();

    if (error) {
        console.error("Erro ao criar franchise:", error);
        throw error;
    }
    return data as Franchise;
}

/**
 * Atualiza os dados de uma franchise existente.
 */
export async function atualizarFranchise(id: number, updates: Partial<Omit<Franchise, 'id'>>): Promise<Franchise> {
    const { data, error } = await supabase
        .from("crm_franchises")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(`Erro ao atualizar franchise com ID ${id}:`, error);
        throw error;
    }
    return data as Franchise;
}

/**
 * Deleta uma franchise do banco de dados.
 */
export async function deletarFranchise(id: number): Promise<void> {
    const { error } = await supabase
        .from("crm_franchises")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(`Erro ao deletar franchise com ID ${id}:`, error);
        throw error;
    }
}
