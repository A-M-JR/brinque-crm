// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Sidebar } from "@/components/layout/sidebar"
// import { Header } from "@/components/layout/header"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Search, Plus, Eye, Edit, Package } from "lucide-react"
// import { isAuthenticated, hasPermission } from "@/lib/auth"

// interface Pedido {
//   id: string
//   cliente: string
//   data: string
//   status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado"
//   total: number
//   itens: number
//   pagamento: "pendente" | "pago" | "cancelado"
// }

// const mockPedidos: Pedido[] = [
//   {
//     id: "PED-001",
//     cliente: "João Silva",
//     data: "2024-01-15",
//     status: "entregue",
//     total: 450.0,
//     itens: 3,
//     pagamento: "pago",
//   },
//   {
//     id: "PED-002",
//     cliente: "Maria Santos",
//     data: "2024-01-14",
//     status: "enviado",
//     total: 280.0,
//     itens: 2,
//     pagamento: "pago",
//   },
//   {
//     id: "PED-003",
//     cliente: "Carlos Oliveira",
//     data: "2024-01-13",
//     status: "processando",
//     total: 720.0,
//     itens: 5,
//     pagamento: "pago",
//   },
//   {
//     id: "PED-004",
//     cliente: "Ana Costa",
//     data: "2024-01-12",
//     status: "pendente",
//     total: 150.0,
//     itens: 1,
//     pagamento: "pendente",
//   },
//   {
//     id: "PED-005",
//     cliente: "Pedro Lima",
//     data: "2024-01-11",
//     status: "cancelado",
//     total: 320.0,
//     itens: 2,
//     pagamento: "cancelado",
//   },
// ]

// export default function PedidosPage() {
//   const router = useRouter()
//   const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       router.push("/login")
//       return
//     }

//     if (!hasPermission("pedidos")) {
//       router.push("/dashboard")
//       return
//     }
//   }, [router])

//   if (!isAuthenticated() || !hasPermission("pedidos")) {
//     return <div>Carregando...</div>
//   }

//   const filteredPedidos = pedidos.filter(
//     (pedido) =>
//       pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pendente":
//         return <Badge variant="secondary">Pendente</Badge>
//       case "processando":
//         return <Badge variant="default">Processando</Badge>
//       case "enviado":
//         return <Badge className="bg-blue-600">Enviado</Badge>
//       case "entregue":
//         return <Badge className="bg-green-600">Entregue</Badge>
//       case "cancelado":
//         return <Badge variant="destructive">Cancelado</Badge>
//       default:
//         return <Badge variant="outline">Desconhecido</Badge>
//     }
//   }

//   const getPagamentoBadge = (pagamento: string) => {
//     switch (pagamento) {
//       case "pago":
//         return <Badge className="bg-green-600">Pago</Badge>
//       case "pendente":
//         return <Badge variant="secondary">Pendente</Badge>
//       case "cancelado":
//         return <Badge variant="destructive">Cancelado</Badge>
//       default:
//         return <Badge variant="outline">Desconhecido</Badge>
//     }
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />

//       <div className="flex-1 lg:ml-64">
//         <Header />

//         <main className="flex-1 space-y-4 p-4 lg:p-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
//               <p className="text-muted-foreground">Gerencie todos os pedidos do sistema</p>
//             </div>
//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button>
//                   <Plus className="mr-2 h-4 w-4" />
//                   Novo Pedido
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                   <DialogTitle>Novo Pedido</DialogTitle>
//                   <DialogDescription>Crie um novo pedido no sistema</DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="cliente" className="text-right">
//                       Cliente
//                     </Label>
//                     <Select>
//                       <SelectTrigger className="col-span-3">
//                         <SelectValue placeholder="Selecione o cliente" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="joao">João Silva</SelectItem>
//                         <SelectItem value="maria">Maria Santos</SelectItem>
//                         <SelectItem value="carlos">Carlos Oliveira</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="produto" className="text-right">
//                       Produto
//                     </Label>
//                     <Select>
//                       <SelectTrigger className="col-span-3">
//                         <SelectValue placeholder="Selecione o produto" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="produto1">Produto A</SelectItem>
//                         <SelectItem value="produto2">Produto B</SelectItem>
//                         <SelectItem value="produto3">Produto C</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="quantidade" className="text-right">
//                       Quantidade
//                     </Label>
//                     <Input id="quantidade" type="number" className="col-span-3" />
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//                     Cancelar
//                   </Button>
//                   <Button onClick={() => setIsDialogOpen(false)}>Criar Pedido</Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>

//           {/* Estatísticas */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
//                 <Package className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{pedidos.length}</div>
//                 <p className="text-xs text-muted-foreground">+3 novos hoje</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{pedidos.filter((p) => p.status === "pendente").length}</div>
//                 <p className="text-xs text-muted-foreground">Aguardando processamento</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">R$ {pedidos.reduce((acc, p) => acc + p.total, 0).toFixed(2)}</div>
//                 <p className="text-xs text-muted-foreground">Todos os pedidos</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   R$ {(pedidos.reduce((acc, p) => acc + p.total, 0) / pedidos.length).toFixed(2)}
//                 </div>
//                 <p className="text-xs text-muted-foreground">Por pedido</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Lista de Pedidos */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Lista de Pedidos</CardTitle>
//               <CardDescription>Visualize e gerencie todos os pedidos</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center space-x-2 mb-4">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Buscar pedidos..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-8"
//                   />
//                 </div>
//                 <Button variant="outline">Filtros</Button>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>ID do Pedido</TableHead>
//                     <TableHead>Cliente</TableHead>
//                     <TableHead>Data</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Pagamento</TableHead>
//                     <TableHead>Itens</TableHead>
//                     <TableHead>Total</TableHead>
//                     <TableHead>Ações</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredPedidos.map((pedido) => (
//                     <TableRow key={pedido.id}>
//                       <TableCell className="font-medium">{pedido.id}</TableCell>
//                       <TableCell>{pedido.cliente}</TableCell>
//                       <TableCell>{new Date(pedido.data).toLocaleDateString("pt-BR")}</TableCell>
//                       <TableCell>{getStatusBadge(pedido.status)}</TableCell>
//                       <TableCell>{getPagamentoBadge(pedido.pagamento)}</TableCell>
//                       <TableCell>{pedido.itens} itens</TableCell>
//                       <TableCell>R$ {pedido.total.toFixed(2)}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center space-x-2">
//                           <Button variant="ghost" size="sm">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="sm">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </main>
//       </div>
//     </div>
//   )
// }
