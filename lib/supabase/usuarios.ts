import { supabase } from "./client"
import bcrypt from "bcryptjs"

export type Usuario = {
    id: number
    name: string
    email: string
    password?: string
    type: string
    group_id: number | null
    franchise_id: number
    created_at?: string
    created_by?: string | null
    modified_at?: string | null
    modified_by?: string | null
    id_status?: number
}

// LISTAR USUÁRIOS POR FRANQUIA
export async function listarUsuariosPorFranquia(franchiseId: number): Promise<Usuario[]> {
    const { data, error } = await supabase
        .from("crm_users")
        .select("*")
        .eq("franchise_id", franchiseId)
        .order("name")
    if (error) throw error
    return data as Usuario[]
}

// SUPERADMIN: LISTAR TODOS
export async function listarTodosUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase
        .from("crm_users")
        .select("*")
        .order("franchise_id")
        .order("name")
    if (error) throw error
    return data as Usuario[]
}

// BUSCAR POR ID
export async function buscarUsuarioPorId(id: number): Promise<Usuario | null> {
    const { data, error } = await supabase
        .from("crm_users")
        .select("*")
        .eq("id", id)
        .single()
    if (error) throw error
    return data as Usuario
}

// CRIAR USUÁRIO (hash de senha)
export async function criarUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    let userData = { ...usuario }

    if (usuario.password) {
        const salt = await bcrypt.genSalt(10)
        userData.password = await bcrypt.hash(usuario.password, salt)
    }

    const { data, error } = await supabase
        .from("crm_users")
        .insert([userData])
        .select()
        .single()

    if (error) throw error
    return data as Usuario
}

// EDITAR USUÁRIO (hash se passar senha nova)
export async function atualizarUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    if (!usuario.id && typeof usuario.id !== "number") {
        throw new Error("ID do usuário é obrigatório para atualização.")
    }
    const updates = { ...usuario }

    if (updates.password) {
        const salt = await bcrypt.genSalt(10)
        updates.password = await bcrypt.hash(updates.password, salt)
    } else {
        delete updates.password // não tocar na senha se estiver vazio
    }

    const { data, error } = await supabase
        .from("crm_users")
        .update(updates)
        .eq("id", usuario.id)
        .select()
        .single()

    if (error) throw error
    return data as Usuario
}

// DELETAR
export async function excluirUsuario(id: number): Promise<void> {
    const { error } = await supabase
        .from("crm_users")
        .delete()
        .eq("id", id)
    if (error) throw error
}

// LISTAR USUÁRIOS DE UM DISTRIBUIDOR
export async function listarUsuariosDistribuidor(franchiseId: number): Promise<Usuario[]> {
    const { data: franquiasFilhas, error: errorFranquias } = await supabase
        .from("crm_franchises")
        .select("id")
        .eq("parent_id", franchiseId)
    if (errorFranquias) throw errorFranquias

    const filhosIds = franquiasFilhas?.map(f => f.id) ?? []

    const { data, error } = await supabase
        .from("crm_users")
        .select("*")
        .in("franchise_id", [franchiseId, ...filhosIds])
        .order("name")

    if (error) throw error
    return data as Usuario[]
}

// LISTAR POR ARRAY DE FRANQUIAS
export async function listarUsuariosPorFranquias(franchiseIds: number[]): Promise<Usuario[]> {
    const { data, error } = await supabase
        .from("crm_users")
        .select("*")
        .in("franchise_id", franchiseIds)
        .order("name")
    if (error) throw error
    return data as Usuario[]
}