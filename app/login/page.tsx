"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { login } from "@/lib/auth/login"
import { ShieldAlert, Mail, Lock, Loader2 } from "lucide-react"

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
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-rows-[40vh_auto] lg:grid-rows-1 lg:grid-cols-2 bg-gray-50">
      {/* Hero visível no mobile e também vira a coluna esquerda em lg+ */}
      <div className="relative">
        {/* Imagem de fundo */}
        <img
          src="/logo-bitwise.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlays para contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/70 to-black/80" />
        <div className="absolute inset-0 [background:radial-gradient(60%_50%_at_20%_20%,rgba(255,255,255,0.08),transparent)]" />

        {/* Texto opcional no hero (esconde no lg, porque o form já tem título) */}
        <div className="relative z-10 flex h-full items-end lg:items-center lg:justify-center">
          <div className="p-6 sm:p-8 lg:p-12 text-white lg:text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Bem-vindo à sua Plataforma
            </h2>
          </div>
        </div>
      </div>

      {/* Formulário — ocupa toda a largura abaixo do hero no mobile; vira coluna da direita em lg+ */}
      <div className="flex items-start lg:items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-10">
        <div className="w-full max-w-sm sm:max-w-md -mt-10 lg:mt-0">
          {/* Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              {/* Header (mostra sempre; no mobile complementa o hero) */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Acesse sua conta
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Entre para gerenciar seus clientes e atividades.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    {/* <a className="text-xs sm:text-sm underline text-muted-foreground hover:text-foreground">Esqueceu a senha?</a> */}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bitwise
          </p>
        </div>
      </div>
    </div>
  )
}