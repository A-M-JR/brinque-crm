//lib\auth\logout.ts
import { supabase } from "@/lib/supabase/client"

export async function logout() {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("session_token")
        : null;

    if (!token) return;

    // Remover token local
    localStorage.removeItem("session_token");

    // Encerrar sessão no banco
    await supabase
        .from("crm_sessions")
        .update({
            is_active: false,
            last_activity: new Date().toISOString(),
        })
        .eq("token", token);

    // Redirecionar
    window.location.href = "/login";
}
