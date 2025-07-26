"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Building2, Users, DollarSign, Calendar, Eye, Settings } from "lucide-react"

interface Plataforma {
  id: string
  nome: string
  tipo: "distribuidor" | "revendedor"
  responsavel: string
  email: string
  telefone: string
  status: "ativo" | "suspenso" | "pendente"
  plano: string
  mensalidade: number
  dataVencimento: string
  totalUsuarios: number
  totalVendas: number
  ultimoAcesso: string
}

export default function PlataformasPage() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([
    {
      id: "DIST-001",
      nome: "Distribuidora São Paulo",
      tipo: "distribuidor",
      responsavel: "João Silva",
      email: "joao@distribuidora.com",
      telefone: "(11) 99999-9999",
      status: "ativo",
      plano: "Premium",
      mensalidade: 299.9,
      dataVencimento: "2024-02-15",
      totalUsuarios: 15,
      totalVendas: 45000.0,
      ultimoAcesso: "2024-01-20T14:30:00Z",
    },
    {
      id: "DIST-002",
      nome: "Distribuidora Rio",
      tipo: "distribuidor",
      responsavel: "Maria Santos",
      email: "maria@distribuidora.com",
      telefone: "(21) 88888-8888",
      status: "ativo",
      plano: "Standard",
      mensalidade: 199.9,
      dataVencimento: "2024-02-20",
      totalUsuarios: 8,
      totalVendas: 28000.0,
      ultimoAcesso: "2024-01-19T16:45:00Z",
    },
    {
      id: "REV-001",
      nome: "Revendedor Premium",
      tipo: "revendedor",
      responsavel: "Carlos Oliveira",
      email: "carlos@revendedor.com",
      telefone: "(11) 77777-7777",
      status: "suspenso",
      plano: "Basic",
      mensalidade: 99.9,
      dataVencimento: "2024-01-15",
      totalUsuarios: 3,
      totalVendas: 12000.0,
      ultimoAcesso: "2024-01-10T09:20:00Z",
    },
  ])

  const [plataformaSelecionada, setPlataformaSelecionada] = useState<Plataforma | null>(null)

  const toggleStatus = (id: string) => {
    setPlataformas((prev) =>
      prev.map((plataforma) =>
        plataforma.id === id
          ? { ...plataforma, status: plataforma.status === "ativo" ? "suspenso" : "ativo" }
          : plataforma,
      ),
    )
  }

  const statusColors = {
    ativo: "bg-green-100 text-green-800",
    suspenso: "bg-red-100 text-red-800",
    pendente: "bg-yellow-100 text-yellow-800",
  }

  const statusLabels = {
    ativo: "Ativo",
    suspenso: "Suspenso",
    pendente: "Pendente",
  }

  const tipoLabels = {
    distribuidor: "Distribuidor",
    revendedor: "Revendedor",
  }

  const estatisticas = {
    totalPlataformas: plataformas.length,
    ativas: plataformas.filter((p) => p.status === "ativo").length,
    suspensas: plataformas.filter((p) => p.status === "suspenso").length,
    faturamentoMensal: plataformas.reduce((acc, p) => acc + p.mensalidade, 0),
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole="admin" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header userRole="admin" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Controle de Plataformas</h1>
              <p className="text-muted-foreground">Gerencie distribuidores e revendedores</p>
            </div>

            {/* Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Plataformas</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.totalPlataformas}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Plataformas Ativas</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.ativas}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Suspensas</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.suspensas}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {estatisticas.faturamentoMensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Plataformas */}
            <Card>
              <CardHeader>
                <CardTitle>Plataformas Cadastradas</CardTitle>
                <CardDescription>Gerencie o acesso e pagamentos das plataformas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plataforma</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Mensalidade</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plataformas.map((plataforma) => (
                      <TableRow key={plataforma.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plataforma.nome}</div>
                            <div className="text-sm text-muted-foreground">{plataforma.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tipoLabels[plataforma.tipo]}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plataforma.responsavel}</div>
                            <div className="text-sm text-muted-foreground">{plataforma.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{plataforma.plano}</TableCell>
                        <TableCell className="font-medium">
                          R$ {plataforma.mensalidade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(plataforma.dataVencimento).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={statusColors[plataforma.status]}>{statusLabels[plataforma.status]}</Badge>
                            <Switch
                              checked={plataforma.status === "ativo"}
                              onCheckedChange={() => toggleStatus(plataforma.id)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPlataformaSelecionada(plataforma)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Detalhes da Plataforma</DialogTitle>
                                  <DialogDescription>Informações completas da plataforma</DialogDescription>
                                </DialogHeader>
                                {plataformaSelecionada && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Informações Gerais */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Informações Gerais</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <strong>Nome:</strong> {plataformaSelecionada.nome}
                                        </div>
                                        <div>
                                          <strong>Tipo:</strong> {tipoLabels[plataformaSelecionada.tipo]}
                                        </div>
                                        <div>
                                          <strong>Responsável:</strong> {plataformaSelecionada.responsavel}
                                        </div>
                                        <div>
                                          <strong>Email:</strong> {plataformaSelecionada.email}
                                        </div>
                                        <div>
                                          <strong>Telefone:</strong> {plataformaSelecionada.telefone}
                                        </div>
                                        <div>
                                          <strong>Último Acesso:</strong>{" "}
                                          {new Date(plataformaSelecionada.ultimoAcesso).toLocaleString("pt-BR")}
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Informações Financeiras */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Informações Financeiras</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <strong>Plano:</strong> {plataformaSelecionada.plano}
                                        </div>
                                        <div>
                                          <strong>Mensalidade:</strong> R${" "}
                                          {plataformaSelecionada.mensalidade.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                          })}
                                        </div>
                                        <div>
                                          <strong>Vencimento:</strong>{" "}
                                          {new Date(plataformaSelecionada.dataVencimento).toLocaleDateString("pt-BR")}
                                        </div>
                                        <div>
                                          <strong>Total de Usuários:</strong> {plataformaSelecionada.totalUsuarios}
                                        </div>
                                        <div>
                                          <strong>Total de Vendas:</strong> R${" "}
                                          {plataformaSelecionada.totalVendas.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                          })}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
