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
import {
  Search,
  Plus,
  MoreHorizontal,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Truck,
  RotateCcw,
} from "lucide-react"

const mockEstoque = [
  {
    id: "1",
    produto: "Produto Premium XYZ",
    categoria: "Eletrônicos",
    estoque: 150,
    estoqueMinimo: 20,
    preco: 225.0,
    ultimaReposicao: "2024-01-10",
    fornecedor: "Fornecedor A",
    status: "disponivel",
  },
  {
    id: "2",
    produto: "Produto Especial ABC",
    categoria: "Casa e Jardim",
    estoque: 12,
    estoqueMinimo: 20,
    preco: 180.0,
    ultimaReposicao: "2024-01-05",
    fornecedor: "Fornecedor B",
    status: "baixo",
  },
  {
    id: "3",
    produto: "Produto Básico DEF",
    categoria: "Roupas",
    estoque: 0,
    estoqueMinimo: 15,
    preco: 89.9,
    ultimaReposicao: "2023-12-20",
    fornecedor: "Fornecedor C",
    status: "esgotado",
  },
  {
    id: "4",
    produto: "Produto Deluxe GHI",
    categoria: "Eletrônicos",
    estoque: 75,
    estoqueMinimo: 30,
    preco: 450.0,
    ultimaReposicao: "2024-01-12",
    fornecedor: "Fornecedor A",
    status: "disponivel",
  },
]

export default function DistribuidorEstoque() {
  const [searchTerm, setSearchTerm] = useState("")
  const [produtosNaLoja, setProdutosNaLoja] = useState<string[]>(["1", "2"]) // IDs dos produtos já na loja

  const filteredEstoque = mockEstoque.filter(
    (item) =>
      item.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string, estoque: number) => {
    if (status === "esgotado" || estoque === 0) {
      return <Badge variant="destructive">Esgotado</Badge>
    }
    if (status === "baixo") {
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

  const toggleProdutoNaLoja = (produtoId: string) => {
    setProdutosNaLoja((prev) =>
      prev.includes(produtoId) ? prev.filter((id) => id !== produtoId) : [...prev, produtoId],
    )
  }

  const produtosEsgotados = mockEstoque.filter((item) => item.estoque === 0).length
  const produtosBaixoEstoque = mockEstoque.filter(
    (item) => item.estoque > 0 && item.estoque <= item.estoqueMinimo,
  ).length
  const valorTotalEstoque = mockEstoque.reduce((sum, item) => sum + item.preco * item.estoque, 0)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="distribuidor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="distribuidor" userName="João Silva" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Controle de Estoque</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Solicitar Reposição
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Entrada Manual
              </Button>
            </div>
          </div>

          {/* Métricas de Estoque */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockEstoque.reduce((sum, item) => sum + item.estoque, 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +150 esta semana
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Esgotados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{produtosEsgotados}</div>
                <p className="text-xs text-muted-foreground">Precisam reposição urgente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{produtosBaixoEstoque}</div>
                <p className="text-xs text-muted-foreground">Abaixo do estoque mínimo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {valorTotalEstoque.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Valor total investido</p>
              </CardContent>
            </Card>
          </div>

          {/* Alertas de Estoque */}
          {(produtosEsgotados > 0 || produtosBaixoEstoque > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                  Alertas de Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {produtosEsgotados > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-red-800">{produtosEsgotados} produto(s) esgotado(s)</p>
                        <p className="text-xs text-red-600">Reposição urgente necessária</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 bg-transparent">
                        Ver Produtos
                      </Button>
                    </div>
                  )}
                  {produtosBaixoEstoque > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          {produtosBaixoEstoque} produto(s) com estoque baixo
                        </p>
                        <p className="text-xs text-yellow-600">Considere fazer reposição</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-600 bg-transparent">
                        Ver Produtos
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Inventário Completo</CardTitle>
              <CardDescription>Controle detalhado de todos os produtos em estoque</CardDescription>
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
                    <TableHead>Estoque Atual</TableHead>
                    <TableHead>Estoque Mínimo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Última Reposição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Na Loja</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstoque.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.produto}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{item.estoque}</span>
                          {item.estoque <= item.estoqueMinimo && item.estoque > 0 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                          {item.estoque === 0 && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell>{item.estoqueMinimo}</TableCell>
                      <TableCell>R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{new Date(item.ultimaReposicao).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{getStatusBadge(item.status, item.estoque)}</TableCell>
                      <TableCell>
                        <Button
                          variant={produtosNaLoja.includes(item.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleProdutoNaLoja(item.id)}
                          className={produtosNaLoja.includes(item.id) ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {produtosNaLoja.includes(item.id) ? "Na Loja" : "Adicionar"}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Entrada
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Ajuste
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Solicitar Reposição
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
