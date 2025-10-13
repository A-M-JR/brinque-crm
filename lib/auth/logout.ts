// lib/auth/logout.ts
import { supabase } from "@/lib/supabase/client"

export async function logout() {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("session_token")
        : null;

    if (!token) return;

    try {
        // Encerrar sessão no banco
        const { error } = await supabase
            .from("crm_sessions")
            .update({
                is_active: false,
                last_activity: new Date().toISOString(),
                modified_at: new Date().toISOString(),
            })
            .eq("token", token);

        if (error) {
            console.error("Erro ao encerrar sessão no banco:", error);
        }
    } catch (err) {
        console.error("Erro inesperado no logout:", err);
    } finally {
        // Remover token local sempre
        localStorage.removeItem("session_token");

        // Redirecionar
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    }
}