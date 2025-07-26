"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, DollarSign, TrendingUp, ShoppingCart, Calendar } from "lucide-react"
import { isAuthenticated, hasPermission } from "@/lib/auth"

interface Venda {
  id: string
  cliente: string
  produto: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  data: string
  vendedor: string
  status: "concluida" | "pendente" | "cancelada"
}

const mockVendas: Venda[] = [
  {
    id: "V-001",
    cliente: "João Silva",
    produto: "Produto Premium XYZ",
    quantidade: 2,
    valorUnitario: 225.0,
    valorTotal: 450.0,
    data: "2024-01-15",
    vendedor: "Maria Santos",
    status: "concluida",
  },
  {
    id: "V-002",
    cliente: "Ana Costa",
    produto: "Produto Especial ABC",
    quantidade: 1,
    valorUnitario: 280.0,
    valorTotal: 280.0,
    data: "2024-01-14",
    vendedor: "João Silva",
    status: "concluida",
  },
  {
    id: "V-003",
    cliente: "Carlos Oliveira",
    produto: "Produto Standard DEF",
    quantidade: 3,
    valorUnitario: 240.0,
    valorTotal: 720.0,
    data: "2024-01-13",
    vendedor: "Maria Santos",
    status: "concluida",
  },
  {
    id: "V-004",
    cliente: "Pedro Lima",
    produto: "Produto Basic GHI",
    quantidade: 1,
    valorUnitario: 150.0,
    valorTotal: 150.0,
    data: "2024-01-12",
    vendedor: "Carlos Mendes",
    status: "pendente",
  },
]

export default function VendasPage() {
  const router = useRouter()
  const [vendas, setVendas] = useState<Venda[]>(mockVendas)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    if (!hasPermission("vendas")) {
      router.push("/dashboard")
      return
    }
  }, [router])

  if (!isAuthenticated() || !hasPermission("vendas")) {
    return <div>Carregando...</div>
  }

  const filteredVendas = vendas.filter(
    (venda) =>
      venda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.produto.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "concluida":
        return <Badge className="bg-green-600">Concluída</Badge>
      case "pendente":
        return <Badge variant="secondary">Pendente</Badge>
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const totalVendas = vendas.reduce((acc, venda) => acc + venda.valorTotal, 0)
  const vendasConcluidas = vendas.filter((v) => v.status === "concluida").length
  const ticketMedio = totalVendas / vendas.length

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 lg:ml-64">
        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Vendas</h2>
              <p className="text-muted-foreground">Gerencie todas as vendas realizadas</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Venda
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nova Venda</DialogTitle>
                  <DialogDescription>Registre uma nova venda no sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cliente" className="text-right">
                      Cliente
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joao">João Silva</SelectItem>
                        <SelectItem value="maria">Maria Santos</SelectItem>
                        <SelectItem value="carlos">Carlos Oliveira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="produto" className="text-right">
                      Produto
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="produto1">Produto Premium XYZ</SelectItem>
                        <SelectItem value="produto2">Produto Especial ABC</SelectItem>
                        <SelectItem value="produto3">Produto Standard DEF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantidade" className="text-right">
                      Quantidade
                    </Label>
                    <Input id="quantidade" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="valor" className="text-right">
                      Valor Unit.
                    </Label>
                    <Input id="valor" type="number" step="0.01" className="col-span-3" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Registrar Venda</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalVendas.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+R$ 450,00 hoje</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Realizadas</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vendasConcluidas}</div>
                <p className="text-xs text-muted-foreground">{vendas.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {ticketMedio.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Por venda</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meta do Mês</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75%</div>
                <p className="text-xs text-muted-foreground">R$ 1.600 de R$ 2.000</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Vendas */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
              <CardDescription>Visualize todas as vendas realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar vendas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">Filtros</Button>
                <Button variant="outline">Exportar</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendas.map((venda) => (
                    <TableRow key={venda.id}>
                      <TableCell className="font-medium">{venda.id}</TableCell>
                      <TableCell>{venda.cliente}</TableCell>
                      <TableCell>{venda.produto}</TableCell>
                      <TableCell>{venda.quantidade}</TableCell>
                      <TableCell>R$ {venda.valorUnitario.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">R$ {venda.valorTotal.toFixed(2)}</TableCell>
                      <TableCell>{new Date(venda.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{venda.vendedor}</TableCell>
                      <TableCell>{getStatusBadge(venda.status)}</TableCell>
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
