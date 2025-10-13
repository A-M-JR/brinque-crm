// lib/auth/login.ts
import { supabase } from "@/lib/supabase/client"
import { v4 as uuid } from "uuid"
import bcrypt from "bcryptjs"

export async function login(email: string, password: string) {
    // Buscar usuário pelo email (não filtrar a senha direto no banco!)
    const { data: user, error } = await supabase
        .from("crm_users")
        .select("*")
        .eq("email", email)
        .eq("id_status", 1) // só usuários ativos
        .single()

        console.log(user, error);
    if (error || !user) return null

    // Comparar a senha com bcrypt
    const passwordOk = await bcrypt.compare(password, user.password)
    if (!passwordOk) return null

    // Gerar token da sessão
    const token = uuid()

    const ip_address =
        typeof window !== "undefined" ? window.location.hostname : null

    const user_agent =
        typeof window !== "undefined" ? navigator.userAgent : null

    // Registrar sessão
    const { error: sessionError } = await supabase.from("crm_sessions").insert({
        user_id: user.id,
        token,
        ip_address,
        user_agent,
        is_active: true,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
    })

    if (sessionError) return null

    // Persistir no localStorage
    localStorage.setItem("session_token", token)

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        group_id: user.group_id,
        franchise_id: user.franchise_id,
    }
}