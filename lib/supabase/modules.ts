import { supabase } from "./client"

// --- Tipagem baseada na sua tabela crm_modules ---
export type Module = {
    id: number;
    name: string;
}

/**
 * Lista todos os módulos disponíveis no sistema, ordenados por nome.
 */
export async function listarModulos(): Promise<Module[]> {
    const { data, error } = await supabase
        .from("crm_modules")
        .select("id, name")
        .order("name");

    if (error) {
        console.error("Erro ao listar módulos:", error);
        throw error;
    }
    return data as Module[];
}
