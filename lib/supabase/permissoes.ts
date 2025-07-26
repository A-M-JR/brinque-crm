import { supabase } from "./client"

// --- Tipagens ---

type GranularPermission = {
    can_view: boolean
    can_edit: boolean
    can_delete: boolean
}

export type GrupoPermissao = {
    id: number
    name: string
    status: boolean
    created_at?: string
    created_by?: string | null
    modified_at?: string | null
    modified_by?: string | null
    franchise_id?: number
    permissions: Record<string, boolean | GranularPermission>
}

export type Permissao = {
    id: number
    name: string
    module_id: number
    can_view: boolean
    can_edit: boolean
    can_delete: boolean
    crm_modules: {
        name: string;
        category: string;
    } | null;
}

// -------------------------------
// GRUPOS DE PERMISSÃO
// -------------------------------

// ATUALIZADO: A função agora aceita um franchiseId para filtrar os resultados
export async function listarGruposPermissao(franchiseId: number): Promise<GrupoPermissao[]> {
    const { data, error } = await supabase
        .from("crm_permission_groups")
        .select("*")
        .eq("franchise_id", franchiseId) // Adiciona o filtro aqui
        .order("name")

    if (error) throw error
    return data as GrupoPermissao[]
}

export async function buscarGrupoPermissao(id: number): Promise<GrupoPermissao | null> {
    const { data, error } = await supabase
        .from("crm_permission_groups")
        .select("*")
        .eq("id", id)
        .single()

    if (error) throw error
    return data as GrupoPermissao
}

export async function criarGrupoPermissao(grupo: Omit<GrupoPermissao, "id" | "created_at" | "created_by" | "modified_at" | "modified_by">): Promise<GrupoPermissao> {
    const { data, error } = await supabase
        .from("crm_permission_groups")
        .insert(grupo)
        .select()
        .single()

    if (error) throw error
    return data as GrupoPermissao
}

export async function editarGrupoPermissao(id: number, updates: Partial<GrupoPermissao>): Promise<GrupoPermissao> {
    const { data, error } = await supabase
        .from("crm_permission_groups")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data as GrupoPermissao
}

export async function deletarGrupoPermissao(id: number): Promise<void> {
    const { error } = await supabase
        .from("crm_permission_groups")
        .delete()
        .eq("id", id)

    if (error) throw error
}

// -------------------------------
// PERMISSÕES INDIVIDUAIS
// -------------------------------

export async function listarPermissoes(): Promise<Permissao[]> {
    const { data, error } = await supabase
        .from("crm_permissions")
        .select("*, crm_modules(name, category)")
        .order("name")

    if (error) throw error
    return data as Permissao[]
}

// ... (resto das suas funções de permissão individual)


export async function buscarPermissaoPorId(id: number): Promise<Permissao | null> {
    const { data, error } = await supabase
        .from("crm_permissions")
        .select("*")
        .eq("id", id)
        .single()

    if (error) throw error
    return data as Permissao
}

export async function criarPermissao(permissao: Omit<Permissao, "id" | "crm_modules">): Promise<Permissao> {
    const { data, error } = await supabase
        .from("crm_permissions")
        .insert(permissao)
        .select()
        .single()

    if (error) throw error
    return data as Permissao
}

export async function editarPermissao(id: number, updates: Partial<Permissao>): Promise<Permissao> {
    const { data, error } = await supabase
        .from("crm_permissions")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data as Permissao
}

export async function deletarPermissao(id: number): Promise<void> {
    const { error } = await supabase
        .from("crm_permissions")
        .delete()
        .eq("id", id)

    if (error) throw error
}
