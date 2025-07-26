import { supabase } from "./client";

// --- Tipagem baseada na sua tabela crm_companies ---
export type Company = {
    id: number;
    created: string;
    name: string;
    email: string | null;
    phone: string | null;
    cpf_cnpj: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
    status: boolean;
    franchise_id: number;
};

/**
 * Lista todos os clientes (empresas) de uma franchise específica.
 */
export async function listarCompaniesPorFranchise(franchiseId: number): Promise<Company[]> {
    const { data, error } = await supabase
        .from("crm_companies")
        .select("*")
        .eq("franchise_id", franchiseId)
        .order("name");

    if (error) {
        console.error("Erro ao listar clientes:", error);
        throw error;
    }
    return data as Company[];
}

/**
 * Busca um cliente específico pelo seu ID.
 */
export async function buscarCompanyPorId(id: number): Promise<Company | null> {
    const { data, error } = await supabase
        .from("crm_companies")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Erro ao buscar cliente com ID ${id}:`, error);
        throw error;
    }
    return data as Company;
}

/**
 * Cria um novo cliente no banco de dados.
 */
export async function criarCompany(companyData: Omit<Company, 'id' | 'created'>): Promise<Company> {
    const { data, error } = await supabase
        .from("crm_companies")
        .insert([companyData])
        .select()
        .single();

    if (error) {
        console.error("Erro ao criar cliente:", error);
        throw error;
    }
    return data as Company;
}

/**
 * Atualiza os dados de um cliente existente.
 */
export async function atualizarCompany(id: number, updates: Partial<Omit<Company, 'id'>>): Promise<Company> {
    const { data, error } = await supabase
        .from("crm_companies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
        throw error;
    }
    return data as Company;
}

/**
 * Deleta um cliente do banco de dados.
 */
export async function deletarCompany(id: number): Promise<void> {
    const { error } = await supabase
        .from("crm_companies")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(`Erro ao deletar cliente com ID ${id}:`, error);
        throw error;
    }
}
