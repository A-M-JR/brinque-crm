"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Building2 } from "lucide-react"
import { authenticateUser } from "@/lib/data/users" // Importação corrigida

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // A chamada 'require' foi removida daqui e substituída pela importação no topo do arquivo.
    const user = authenticateUser(email, password)

    if (user) {
      // Salvar usuário no localStorage para simular sessão
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Redirecionar baseado no role do usuário
      if (user.role === "admin") {
        window.location.href = "/admin/dashboard"
      } else if (user.role === "distribuidor") {
        window.location.href = "/distribuidor/dashboard"
      } else if (user.role === "revendedor") {
        window.location.href = "/revendedor/dashboard"
      }
    } else {
      alert("Email ou senha incorretos!")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">BitWise Agency</CardTitle>
          <CardDescription>Faça login para acessar sua plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Teste:</h3>
            <div className="space-y-2 text-xs">
              {/* <div>
                <strong>Admin:</strong> admin@crmsaas.com / admin123
              </div> */}
              <div>
                <strong>Distribuidor:</strong> julio@distribuidor.com / dist123
              </div>
              <div>
                <strong>Revendedor:</strong> maria@revendedor.com / rev123
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Esqueceu sua senha?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Recuperar
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
