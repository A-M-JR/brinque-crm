"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Phone,
  Mail,
  User,
  Users,
  ShoppingCart,
  ArrowUpRight,
  TrendingUp,
  Award,
} from "lucide-react"

const mockRevendedores = [
  {
    id: "1",
    nome: "Maria Santos",
    email: "maria@revendedor.com",
    telefone: "(11) 99999-1111",
    dataIngresso: "2023-08-15",
    vendas: 4250.0,
    clientes: 12,
    meta: 5000.0,
    status: "ativo",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    nome: "Pedro Lima",
    email: "pedro@revendedor.com",
    telefone: "(11) 88888-2222",
    dataIngresso: "2023-09-20",
    vendas: 3890.0,
    clientes: 8,
    meta: 4000.0,
    status: "ativo",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    nome: "Lucia Costa",
    email: "lucia@revendedor.com",
    telefone: "(11) 77777-3333",
    dataIngresso: "2023-10-10",
    vendas: 2100.0,
    clientes: 6,
    meta: 3000.0,
    status: "ativo",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    nome: "Roberto Silva",
    email: "roberto@revendedor.com",
    telefone: "(11) 66666-4444",
    dataIngresso: "2023-11-05",
    vendas: 1200.0,
    clientes: 3,
    meta: 2000.0,
    status: "pendente",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function DistribuidorRevendedores() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRevendedores = mockRevendedores.filter(
    (revendedor) =>
      revendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revendedor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "default",
      pendente: "secondary",
      inativo: "outline",
    } as const

    const colors = {
      ativo: "bg-green-600",
      pendente: "bg-yellow-600",
      inativo: "bg-gray-600",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getPerformanceBadge = (vendas: number, meta: number) => {
    const percentual = (vendas / meta) * 100
    if (percentual >= 100) return <Award className="h-4 w-4 text-yellow-600" />
    if (percentual >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    return <TrendingUp className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="distribuidor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="distribuidor" userName="João Silva" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Meus Revendedores</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Revendedor
            </Button>
          </div>

          {/* Métricas dos Revendedores */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Revendedores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockRevendedores.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2 este mês
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revendedores Ativos</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockRevendedores.filter((r) => r.status === "ativo").length}</div>
                <p className="text-xs text-muted-foreground">
                  {(
                    (mockRevendedores.filter((r) => r.status === "ativo").length / mockRevendedores.length) *
                    100
                  ).toFixed(0)}
                  % do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas da Rede</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${" "}
                  {mockRevendedores
                    .reduce((sum, r) => sum + r.vendas, 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Faturamento total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance Média</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    mockRevendedores.reduce((sum, r) => sum + (r.vendas / r.meta) * 100, 0) / mockRevendedores.length
                  ).toFixed(1)}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Das metas estabelecidas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rede de Revendedores</CardTitle>
              <CardDescription>Gerencie sua equipe de revendedores e acompanhe performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar revendedores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Revendedor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Clientes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRevendedores.map((revendedor) => (
                    <TableRow key={revendedor.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={revendedor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{revendedor.nome}</span>
                      </TableCell>
                      <TableCell>{revendedor.email}</TableCell>
                      <TableCell>
                        R$ {revendedor.vendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>R$ {revendedor.meta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={(revendedor.vendas / revendedor.meta) * 100} className="w-16 h-2" />
                          <span className="text-xs">{((revendedor.vendas / revendedor.meta) * 100).toFixed(0)}%</span>
                          {getPerformanceBadge(revendedor.vendas, revendedor.meta)}
                        </div>
                      </TableCell>
                      <TableCell>{revendedor.clientes} clientes</TableCell>
                      <TableCell>{getStatusBadge(revendedor.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Contatar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Definir Meta
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
