"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function HomePage() {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            router.push(isAuthenticated ? "/dashboard" : "/login")
        }
    }, [loading, isAuthenticated, router])

    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    )
}
