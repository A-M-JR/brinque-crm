import { useEffect, useState, useCallback } from "react"

export function useUsuarios(franchiseId: number | null) {
    const [usuarios, setUsuarios] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsuarios = useCallback(async () => {
        if (!franchiseId) {
            setUsuarios([])
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/usuarios?franchise_id=${franchiseId}`)
            const data = await res.json()
            setUsuarios(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Erro ao buscar usuários:", error)
        } finally {
            setLoading(false)
        }
    }, [franchiseId])

    useEffect(() => {
        fetchUsuarios()
    }, [fetchUsuarios])

    return {
        usuarios,
        loading,
        refetch: fetchUsuarios,
    }
}
