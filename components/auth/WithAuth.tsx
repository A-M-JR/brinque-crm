"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

interface Props {
    module: string
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function WithAuth({
    module,
    children,
    fallback = null,
}: Props) {
    const { group, franchise, loading, isAuthenticated } = useAuth()
    const [allowed, setAllowed] = useState<boolean | null>(null)

    useEffect(() => {
        const checkPermission = () => {
            if (!isAuthenticated || !group || !franchise) {
                setAllowed(false)
                return
            }

            // O nome do módulo TEM QUE BATER com o do banco!
            if (!franchise.modules_enabled?.includes(module)) {
                setAllowed(false)
                return
            }

            if (!group.permissions?.[module]) {
                setAllowed(false)
                return
            }

            setAllowed(true)
        }

        if (!loading) {
            checkPermission()
        }
    }, [group, franchise, isAuthenticated, loading, module])

    if (loading || allowed === null) return <p>Verificando permissões...</p>
    if (!allowed) return fallback

    return <>{children}</>
}

