"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Package, AlertTriangle, TrendingUp, ArrowUpRight, ShoppingCart } from "lucide-react"

const mockEstoque = [
  {
    id: "1",
    produto: "Produto Premium XYZ",
    categoria: "Eletrônicos",
    disponivel: 25,
    reservado: 3,
    preco: 225.0,
    vendas: 15,
    status: "disponivel",
  },
  {
    id: "2",
    produto: "Produto Especial ABC",
    categoria: "Casa e Jardim",
    disponivel: 8,
    reservado: 2,
    preco: 180.0,
    vendas: 12,
    status: "baixo",
  },
  {
    id: "3",
    produto: "Produto Básico DEF",
    categoria: "Roupas",
    disponivel: 0,
    reservado: 0,
    preco: 89.9,
    vendas: 8,
    status: "esgotado",
  },
  {
    id: "4",
    produto: "Produto Deluxe GHI",
    categoria: "Eletrônicos",
    disponivel: 18,
    reservado: 1,
    preco: 450.0,
    vendas: 10,
    status: "disponivel",
  },
]

export default function RevendedorEstoque() {
  const [searchTerm, setSearchTerm] = useState("")
  const [produtosNaLoja, setProdutosNaLoja] = useState<string[]>(["1", "4"]) // IDs dos produtos já na loja

  const filteredEstoque = mockEstoque.filter(
    (item) =>
      item.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string, disponivel: number) => {
    if (status === "esgotado" || disponivel === 0) {
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

  const produtosDisponiveis = mockEstoque.filter((item) => item.disponivel > 0).length
  const produtosEsgotados = mockEstoque.filter((item) => item.disponivel === 0).length
  const totalProdutos = mockEstoque.reduce((sum, item) => sum + item.disponivel, 0)
  const valorEstoque = mockEstoque.reduce((sum, item) => sum + item.preco * item.disponivel, 0)

  const toggleProdutoNaLoja = (produtoId: string) => {
    setProdutosNaLoja((prev) =>
      prev.includes(produtoId) ? prev.filter((id) => id !== produtoId) : [...prev, produtoId],
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="revendedor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="revendedor" userName="Maria Santos" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Meu Estoque</h2>
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Solicitar Produtos
            </Button>
          </div>

          {/* Métricas de Estoque */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Disponíveis</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{produtosDisponiveis}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {totalProdutos} unidades
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
                <p className="text-xs text-muted-foreground">Precisam ser solicitados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {valorEstoque.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Valor total disponível</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockEstoque.reduce((sum, item) => sum + item.vendas, 0)}</div>
                <p className="text-xs text-muted-foreground">Produtos vendidos</p>
              </CardContent>
            </Card>
          </div>

          {/* Alertas de Estoque */}
          {produtosEsgotados > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                  Produtos Esgotados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-red-800">{produtosEsgotados} produto(s) esgotado(s)</p>
                    <p className="text-xs text-red-600">Solicite reposição ao seu distribuidor</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 bg-transparent">
                    Solicitar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Produtos Disponíveis</CardTitle>
              <CardDescription>Controle dos produtos disponíveis para venda</CardDescription>
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
                    <TableHead>Disponível</TableHead>
                    <TableHead>Reservado</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Vendas</TableHead>
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
                          <span>{item.disponivel}</span>
                          {item.disponivel <= 10 && item.disponivel > 0 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                          {item.disponivel === 0 && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell>{item.reservado}</TableCell>
                      <TableCell>R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{item.vendas} vendas</TableCell>
                      <TableCell>{getStatusBadge(item.status, item.disponivel)}</TableCell>
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
                        {item.disponivel === 0 ? (
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                            Solicitar
                          </Button>
                        ) : (
                          <Button size="sm">Vender</Button>
                        )}
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
