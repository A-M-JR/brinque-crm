"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Package, Truck, CheckCircle, Search, Filter, Download, Plus } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PedidoDetalhes } from "./pedido-detalhes"
import { NovoPedidoDialog } from "./novo-pedido-dialog"
import { usePedidos, type Pedido } from "@/hooks/use-pedidos"
import { statusColors, statusLabels } from "@/lib/constants/pedidos"

interface PedidosPageProps {
  userRole: "admin" | "distribuidor" | "revendedor"
  title: string
  description: string
}

export function PedidosPage({ userRole, title, description }: PedidosPageProps) {
  const {
    pedidosFiltrados,
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    atualizarStatus,
    criarPedido,
    estatisticas,
  } = usePedidos(userRole)

  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)
  const [showNovoPedido, setShowNovoPedido] = useState(false)

  const showLojaFields = userRole === "admin"

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={userRole} />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header userRole={userRole} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowNovoPedido(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pedido
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                  <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.pendentes}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processando</CardTitle>
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.processando}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enviados</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.enviados}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entregues</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.entregues}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                  <div className="text-green-600">R$</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {estatisticas.faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por número, cliente ou email..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="processando">Processando</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Pedidos */}
            <Card>
              <CardHeader>
                <CardTitle>Pedidos ({pedidosFiltrados.length})</CardTitle>
                <CardDescription>
                  Lista dos pedidos {userRole === "admin" ? "do sistema" : "da sua loja"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      {showLojaFields && <TableHead>Loja</TableHead>}
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidosFiltrados.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-medium">#{pedido.numero}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{pedido.cliente}</div>
                            <div className="text-sm text-muted-foreground">{pedido.email}</div>
                          </div>
                        </TableCell>
                        {showLojaFields && (
                          <TableCell>
                            <div>
                              <div className="font-medium">{pedido.loja}</div>
                              <div className="text-sm text-muted-foreground">{pedido.vendedor}</div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>{new Date(pedido.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[pedido.status]}>{statusLabels[pedido.status]}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          R$ {pedido.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{pedido.pagamento}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setPedidoSelecionado(pedido)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Pedido #{pedido.numero}</DialogTitle>
                                <DialogDescription>Informações completas do pedido</DialogDescription>
                              </DialogHeader>
                              {pedidoSelecionado && (
                                <PedidoDetalhes
                                  pedido={pedidoSelecionado}
                                  onStatusChange={atualizarStatus}
                                  showLoja={showLojaFields}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <NovoPedidoDialog
              open={showNovoPedido}
              onOpenChange={setShowNovoPedido}
              onSubmit={criarPedido}
              showLojaFields={showLojaFields}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
