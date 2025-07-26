import { supabase } from "@/lib/supabase/client"

export interface SessionData {
    user: any
    franchise: any
    group: any
}

export async function getSessionData(): Promise<SessionData | null> {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("session_token")
        : null

    if (!token) return null

    // Buscar sessão + usuário
    const { data: session, error: sessionError } = await supabase
        .from("crm_sessions")
        .select("*, user:crm_users(*)")
        .eq("token", token)
        .eq("is_active", true)
        .maybeSingle()

    if (sessionError || !session || !session.user) return null

    // Buscar dados complementares
    const [franchiseResult, groupResult] = await Promise.all([
        supabase
            .from("crm_franchises")
            .select("*")
            .eq("id", session.user.franchise_id)
            .maybeSingle(),

        supabase
            .from("crm_permission_groups")
            .select("*")
            .eq("id", session.user.group_id)
            .maybeSingle(),
    ])

    return {
        user: session.user,
        franchise: franchiseResult.data ?? null,
        group: groupResult.data ?? null,
    }
}