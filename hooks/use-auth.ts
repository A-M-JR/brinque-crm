"use client"

import { useEffect, useState } from "react"
import { getSessionData } from "@/lib/auth/get-session-data"
import { logout } from "@/lib/auth/logout"

export function useAuth() {
    const [user, setUser] = useState<any>(null)
    const [franchise, setFranchise] = useState<any>(null)
    const [group, setGroup] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadSession = async () => {
            setLoading(true)
            // console.log("🔁 Carregando sessão...")
            try {
                const session = await getSessionData()
                // console.log("✅ Sessão carregada:", session)
                if (!session) {
                    await logout()
                    setLoading(false)
                    return
                }

                setUser(session.user)
                setFranchise(session.franchise)
                setGroup(session.group)

                // 🔍 DEBUG
                // console.log("useAuth -> group permissions:", session.group?.permissions)
                // console.log("useAuth -> franchise modules:", session.franchise?.modules_enabled)
            } catch (err) {
                console.error("❌ Erro ao carregar sessão:", err)
                await logout()
            } finally {
                setLoading(false)
            }
        }

        loadSession()
    }, [])


    return {
        user,
        franchise,
        group,
        loading,
        isAuthenticated: !!user,
    }
}
