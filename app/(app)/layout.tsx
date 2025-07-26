// app/(app)/layout.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/hooks/use-auth"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, group, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Proteção: só acessa painel se estiver autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  // Evita mostrar painel enquanto não terminou de checar login
  if (loading || !isAuthenticated) {
    return <div className="flex-1 flex items-center justify-center">Carregando...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header userRole={group?.name ?? "Usuário"} userName={user?.name ?? ""} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
