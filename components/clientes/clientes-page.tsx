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
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, Users, UserCheck, UserX, UserMinus, Search, Filter, Download, Plus } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ClienteDetalhes } from "./cliente-detalhes"
import { NovoClienteDialog } from "./novo-cliente-dialog"
import { useClientes, type Cliente } from "@/hooks/use-clientes"

interface ClientesPageProps {
  userRole: "admin" | "distribuidor" | "revendedor"
  title: string
  description: string
  userId?: string
}

const statusColors = {
  ativo: "bg-green-100 text-green-800",
  inativo: "bg-yellow-100 text-yellow-800",
  bloqueado: "bg-red-100 text-red-800",
}

const statusLabels = {
  ativo: "Ativo",
  inativo: "Inativo",
  bloqueado: "Bloqueado",
}

export function ClientesPage({ userRole, title, description, userId }: ClientesPageProps) {
  const {
    clientesFiltrados,
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    loading,
    atualizarStatus,
    criarCliente,
    estatisticas,
  } = useClientes(userRole, userId)

  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [showNovoCliente, setShowNovoCliente] = useState(false)

  const showDistribuidorInfo = userRole === "admin"

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar userRole={userRole} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header userRole={userRole} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

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
                <Button onClick={() => setShowNovoCliente(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.ativos}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inativos</CardTitle>
                  <UserMinus className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.inativos}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
                  <UserX className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.bloqueados}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                  <div className="text-green-600">R$</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {estatisticas.faturamentoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
                        placeholder="Buscar por nome, email, CPF ou CNPJ..."
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
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="bloqueado">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle>Clientes ({clientesFiltrados.length})</CardTitle>
                <CardDescription>
                  Lista dos clientes {userRole === "admin" ? "da plataforma" : "da sua carteira"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      {showDistribuidorInfo && <TableHead>Distribuidor</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead>Total Compras</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesFiltrados.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{cliente.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {cliente.cpf && `CPF: ${cliente.cpf}`}
                              {cliente.cnpj && `CNPJ: ${cliente.cnpj}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{cliente.email}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        {showDistribuidorInfo && (
                          <TableCell>
                            <div>
                              <div className="text-sm">{cliente.distribuidorId}</div>
                              <div className="text-xs text-muted-foreground">{cliente.revendedorId}</div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge className={statusColors[cliente.status]}>{statusLabels[cliente.status]}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          R$ {cliente.totalCompras.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setClienteSelecionado(cliente)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Cliente</DialogTitle>
                                <DialogDescription>Informações completas do cliente</DialogDescription>
                              </DialogHeader>
                              {clienteSelecionado && (
                                <ClienteDetalhes
                                  cliente={clienteSelecionado}
                                  onStatusChange={atualizarStatus}
                                  showDistribuidor={showDistribuidorInfo}
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

            <NovoClienteDialog open={showNovoCliente} onOpenChange={setShowNovoCliente} onSubmit={criarCliente} />
          </div>
        </main>
      </div>
    </div>
  )
}
