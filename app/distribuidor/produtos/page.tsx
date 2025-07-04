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
import { Search, Plus, MoreHorizontal, Edit, Trash2, Package, AlertTriangle } from "lucide-react"

const mockProducts = [
  {
    id: "1",
    nome: "Produto Premium XYZ",
    categoria: "Eletrônicos",
    preco: 225.0,
    estoque: 150,
    status: "ativo",
    vendas: 45,
  },
  {
    id: "2",
    nome: "Produto Especial ABC",
    categoria: "Casa e Jardim",
    preco: 180.0,
    estoque: 12,
    status: "ativo",
    vendas: 32,
  },
  {
    id: "3",
    nome: "Produto Básico DEF",
    categoria: "Roupas",
    preco: 89.9,
    estoque: 0,
    status: "inativo",
    vendas: 18,
  },
  {
    id: "4",
    nome: "Produto Deluxe GHI",
    categoria: "Eletrônicos",
    preco: 450.0,
    estoque: 75,
    status: "ativo",
    vendas: 28,
  },
]

export default function DistribuidorProdutos() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string, estoque: number) => {
    if (estoque === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    }
    if (estoque < 20) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Estoque Baixo
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Disponível
      </Badge>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="distribuidor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="distribuidor" userName="João Silva" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Gestão de Produtos</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </div>

          {/* Métricas de Produtos */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProducts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {mockProducts.filter((p) => p.status === "ativo").length} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProducts.reduce((sum, p) => sum + p.estoque, 0)}</div>
                <p className="text-xs text-muted-foreground">Unidades disponíveis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos em Falta</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {mockProducts.filter((p) => p.estoque === 0).length}
                </div>
                <p className="text-xs text-muted-foreground">Precisam reposição</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${" "}
                  {mockProducts
                    .reduce((sum, p) => sum + p.preco * p.estoque, 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Valor total em estoque</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Catálogo de Produtos</CardTitle>
              <CardDescription>Gerencie seus produtos e controle de estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.nome}</TableCell>
                      <TableCell>{product.categoria}</TableCell>
                      <TableCell>R$ {product.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{product.estoque}</span>
                          {product.estoque < 20 && product.estoque > 0 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                          {product.estoque === 0 && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status, product.estoque)}</TableCell>
                      <TableCell>{product.vendas} vendas</TableCell>
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
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Repor Estoque
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
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
