"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Package,
  Eye,
} from "lucide-react"

const mockVendas = [
  {
    id: "1",
    cliente: "João Silva",
    produto: "Produto Premium XYZ",
    quantidade: 2,
    valor: 450.0,
    comissao: 45.0,
    data: "2024-01-15T14:30:00Z",
    status: "concluida",
    pagamento: "cartao",
  },
  {
    id: "2",
    cliente: "Ana Costa",
    produto: "Produto Especial ABC",
    quantidade: 1,
    valor: 180.0,
    comissao: 18.0,
    data: "2024-01-15T10:15:00Z",
    status: "processando",
    pagamento: "pix",
  },
  {
    id: "3",
    cliente: "Carlos Oliveira",
    produto: "Produto Deluxe GHI",
    quantidade: 1,
    valor: 450.0,
    comissao: 45.0,
    data: "2024-01-14T16:45:00Z",
    status: "concluida",
    pagamento: "boleto",
  },
  {
    id: "4",
    cliente: "Lucia Santos",
    produto: "Produto Premium XYZ",
    quantidade: 1,
    valor: 225.0,
    comissao: 22.5,
    data: "2024-01-14T09:20:00Z",
    status: "cancelada",
    pagamento: "cartao",
  },
]

export default function RevendedorVendas() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredVendas = mockVendas.filter((venda) => {
    const matchesSearch =
      venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.produto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || venda.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      concluida: "default",
      processando: "secondary",
      cancelada: "destructive",
    } as const

    const colors = {
      concluida: "bg-green-600",
      processando: "bg-yellow-600",
      cancelada: "bg-red-600",
    }

    const labels = {
      concluida: "Concluída",
      processando: "Processando",
      cancelada: "Cancelada",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getPagamentoBadge = (pagamento: string) => {
    const labels = {
      cartao: "Cartão",
      pix: "PIX",
      boleto: "Boleto",
    }

    return <Badge variant="outline">{labels[pagamento as keyof typeof labels]}</Badge>
  }

  const vendasConcluidas = mockVendas.filter((v) => v.status === "concluida")
  const totalVendas = vendasConcluidas.reduce((sum, v) => sum + v.valor, 0)
  const totalComissoes = vendasConcluidas.reduce((sum, v) => sum + v.comissao, 0)
  const ticketMedio = vendasConcluidas.length > 0 ? totalVendas / vendasConcluidas.length : 0

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="revendedor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="revendedor" userName="Maria Santos" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Minhas Vendas</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </div>

          {/* Métricas de Vendas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +18.5% este mês
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comissões</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalComissoes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">10% sobre vendas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Por venda concluída</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vendasConcluidas.reduce((sum, v) => sum + v.quantidade, 0)}</div>
                <p className="text-xs text-muted-foreground">Unidades vendidas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
              <CardDescription>Acompanhe todas as suas vendas e comissões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar vendas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="processando">Processando</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendas.map((venda) => (
                    <TableRow key={venda.id}>
                      <TableCell className="font-medium">{venda.cliente}</TableCell>
                      <TableCell>{venda.produto}</TableCell>
                      <TableCell>{venda.quantidade}</TableCell>
                      <TableCell>R$ {venda.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>R$ {venda.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{getPagamentoBadge(venda.pagamento)}</TableCell>
                      <TableCell>{new Date(venda.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{getStatusBadge(venda.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            {venda.status === "processando" && (
                              <DropdownMenuItem>
                                <Package className="mr-2 h-4 w-4" />
                                Atualizar Status
                              </DropdownMenuItem>
                            )}
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
