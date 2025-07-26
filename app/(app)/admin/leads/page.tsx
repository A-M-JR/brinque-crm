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
import { Search, UserPlus, Phone, Mail, Calendar } from "lucide-react"

const mockLeads = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-9999",
    origem: "Site Principal",
    status: "novo",
    dataCaptura: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 88888-8888",
    origem: "Facebook Ads",
    status: "contatado",
    dataCaptura: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    telefone: "(11) 77777-7777",
    origem: "Google Ads",
    status: "qualificado",
    dataCaptura: "2024-01-13T09:20:00Z",
  },
  {
    id: "4",
    nome: "Ana Costa",
    email: "ana.costa@email.com",
    telefone: "(11) 66666-6666",
    origem: "Indicação",
    status: "convertido",
    dataCaptura: "2024-01-12T14:10:00Z",
  },
]

export default function AdminLeads() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      novo: "default",
      contatado: "secondary",
      qualificado: "outline",
      convertido: "default",
    } as const

    const colors = {
      novo: "bg-blue-600",
      contatado: "bg-yellow-600",
      qualificado: "bg-purple-600",
      convertido: "bg-green-600",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="admin" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="admin" userName="Admin Sistema" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Captura de Leads</h2>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
          </div>

          {/* Métricas de Leads */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockLeads.length}</div>
                <p className="text-xs text-muted-foreground">+3 novos hoje</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25%</div>
                <p className="text-xs text-muted-foreground">
                  {mockLeads.filter((l) => l.status === "convertido").length} convertidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Qualificados</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockLeads.filter((l) => l.status === "qualificado").length}</div>
                <p className="text-xs text-muted-foreground">Prontos para contato</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Origem Principal</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Site</div>
                <p className="text-xs text-muted-foreground">50% dos leads</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Leads Capturados</CardTitle>
              <CardDescription>Gerencie todos os leads capturados pela plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar leads..."
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
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contatado">Contatado</SelectItem>
                    <SelectItem value="qualificado">Qualificado</SelectItem>
                    <SelectItem value="convertido">Convertido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.nome}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.telefone}</TableCell>
                      <TableCell>{lead.origem}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{new Date(lead.dataCaptura).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="w-3 h-3 mr-1" />
                            Contatar
                          </Button>
                          <Button size="sm">Atribuir</Button>
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
