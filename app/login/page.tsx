"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { login } from "@/lib/auth/login"
import { ShieldAlert, Mail, Lock, Loader2, Package } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await login(email, password)
      if (user) {
        router.push("/dashboard")
      } else {
        setError("Email ou senha incorretos. Por favor, verifique suas credenciais.")
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      {/* Coluna da Esquerda (Visual) */}
      <div className="hidden bg-muted lg:flex lg:flex-col items-center justify-center p-10 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Bem-vindo à sua Plataforma</h1>
          <p className="mt-4 text-lg text-gray-300">
            Acesse com suas credenciais para gerenciar seu negócio.
          </p>
        </div>
      </div>

      {/* Coluna da Direita (Formulário) */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Acesse sua conta</h1>
            <p className="text-balance text-muted-foreground">
              Entre para gerenciar seus clientes e atividades.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                {/* <Link href="/forgot-password"className="ml-auto inline-block text-sm underline"> Esqueceu a senha? </Link> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Erro no Login</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
