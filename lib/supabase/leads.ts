import { supabase } from "./client";

// --- Tipagem baseada na sua tabela crm_leads ---
export type Lead = {
    id: number;
    created: string; // Corresponde à coluna 'created'
    name: string;
    email: string;
    cpf: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    status: 'novo' | 'contatado' | 'convertido' | 'perdido';
    franchise_id: number;
    form_data: Record<string, any> | null; // Para a coluna JSONB
};

/**
 * Cria um novo lead no banco de dados.
 * Usado pela API que recebe os dados do site.
 */
export async function criarLead(leadData: Omit<Lead, 'id' | 'created'>): Promise<Lead> {
    const { data, error } = await supabase
        .from("crm_leads")
        .insert([leadData])
        .select()
        .single();

    if (error) {
        console.error("Erro ao criar lead:", error);
        throw error;
    }
    return data as Lead;
}

/**
 * Lista todos os leads de uma franchise específica.
 * Usado pela página de visualização de leads no CRM.
 */
export async function listarLeadsPorFranchise(franchiseId: number): Promise<Lead[]> {
    const { data, error } = await supabase
        .from("crm_leads")
        .select("*")
        .eq("franchise_id", franchiseId)
        .order("created", { ascending: false }); // Ordena pela coluna 'created'

    if (error) {
        console.error("Erro ao listar leads:", error);
        throw error;
    }
    return data as Lead[];
}

/**
 * Busca um lead específico pelo seu ID.
 */
export async function buscarLeadPorId(id: number): Promise<Lead | null> {
    const { data, error } = await supabase
        .from("crm_leads")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Erro ao buscar lead com ID ${id}:`, error);
        throw error;
    }
    return data as Lead;
}

/**
 * Atualiza o status de um lead.
 */
export async function atualizarStatusLead(id: number, status: Lead['status']): Promise<Lead> {
    const { data, error } = await supabase
        .from("crm_leads")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(`Erro ao atualizar lead ${id}:`, error);
        throw error;
    }
    return data as Lead;
}

/**
 * Deleta um lead do banco de dados.
 */
export async function deletarLead(id: number): Promise<void> {
    const { error } = await supabase
        .from("crm_leads")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(`Erro ao deletar lead com ID ${id}:`, error);
        throw error;
    }
}
