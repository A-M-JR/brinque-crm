"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const mockPayments = [
  {
    id: "1",
    distribuidor: "João Silva",
    valor: 2450.0,
    vencimento: "2024-01-20",
    status: "atrasado",
    diasAtraso: 15,
  },
  {
    id: "2",
    distribuidor: "Carlos Mendes",
    valor: 1890.0,
    vencimento: "2024-01-25",
    status: "pendente",
    diasAtraso: 7,
  },
  {
    id: "3",
    distribuidor: "Ana Paula",
    valor: 3200.0,
    vencimento: "2024-02-01",
    status: "pago",
    diasAtraso: 0,
  },
  {
    id: "4",
    distribuidor: "Roberto Santos",
    valor: 1750.0,
    vencimento: "2024-02-05",
    status: "pendente",
    diasAtraso: 0,
  },
]

export default function AdminPagamentos() {
  const getStatusBadge = (status: string, diasAtraso: number) => {
    if (status === "pago") {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Pago
        </Badge>
      )
    }
    if (status === "atrasado" || diasAtraso > 0) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Atrasado
        </Badge>
      )
    }
    return (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>
    )
  }

  const totalPendente = mockPayments.filter((p) => p.status !== "pago").reduce((sum, p) => sum + p.valor, 0)

  const totalAtrasado = mockPayments
    .filter((p) => p.status === "atrasado" || p.diasAtraso > 0)
    .reduce((sum, p) => sum + p.valor, 0)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="admin" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="admin" userName="Admin Sistema" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Controle de Pagamentos</h2>
            <Button>Gerar Relatório</Button>
          </div>

          {/* Resumo Financeiro */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockPayments.filter((p) => p.status !== "pago").length} pagamentos pendentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total em Atraso</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalAtrasado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockPayments.filter((p) => p.diasAtraso > 0).length} pagamentos atrasados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Inadimplência</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((mockPayments.filter((p) => p.diasAtraso > 0).length / mockPayments.length) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Baseado nos últimos pagamentos</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos dos Distribuidores</CardTitle>
              <CardDescription>Controle de pagamentos e inadimplência</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Distribuidor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dias em Atraso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.distribuidor}</TableCell>
                      <TableCell>R$ {payment.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{new Date(payment.vencimento).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{getStatusBadge(payment.status, payment.diasAtraso)}</TableCell>
                      <TableCell>
                        {payment.diasAtraso > 0 ? (
                          <span className="text-red-600 font-medium">{payment.diasAtraso} dias</span>
                        ) : (
                          <span className="text-green-600">Em dia</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            Enviar Cobrança
                          </Button>
                          {payment.status !== "pago" && <Button size="sm">Marcar como Pago</Button>}
                        </div>
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
