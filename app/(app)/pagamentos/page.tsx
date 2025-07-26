// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Sidebar } from "@/components/layout/sidebar"
// import { Header } from "@/components/layout/header"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Search, DollarSign } from "lucide-react"
// import { isAuthenticated, hasPermission } from "@/lib/auth"

// const mockPagamentos = [
//   {
//     id: "PAG-001",
//     cliente: "João Silva",
//     valor: 450.0,
//     metodo: "cartao",
//     status: "aprovado",
//     data: "2024-01-15",
//   },
//   {
//     id: "PAG-002",
//     cliente: "Maria Santos",
//     valor: 280.0,
//     metodo: "pix",
//     status: "aprovado",
//     data: "2024-01-16",
//   },
//   {
//     id: "PAG-003",
//     cliente: "Carlos Oliveira",
//     valor: 720.0,
//     metodo: "boleto",
//     status: "pendente",
//     data: "2024-01-20",
//   },
// ]

// export default function PagamentosPage() {
//   const router = useRouter()
//   const [pagamentos] = useState(mockPagamentos)
//   const [searchTerm, setSearchTerm] = useState("")

//   useEffect(() => {
//     if (!isAuthenticated() || !hasPermission("pagamentos")) {
//       router.push("/dashboard")
//     }
//   }, [router])

//   const filteredPagamentos = pagamentos.filter((pagamento) =>
//     pagamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   const getStatusBadge = (status: string) => {
//     const colors = {
//       aprovado: "bg-green-600",
//       pendente: "secondary",
//       rejeitado: "destructive",
//     }
//     return <Badge className={colors[status as keyof typeof colors] || ""}>{status}</Badge>
//   }

//   const totalRecebido = pagamentos.filter((p) => p.status === "aprovado").reduce((acc, p) => acc + p.valor, 0)

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 lg:ml-64">
//         <Header />
//         <main className="p-6 space-y-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold">Pagamentos</h1>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
//                 <DollarSign className="h-4 w-4 text-green-600" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-green-600">R$ {totalRecebido.toFixed(2)}</div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Histórico de Pagamentos</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center space-x-2 mb-4">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Buscar pagamentos..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-8"
//                   />
//                 </div>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>ID</TableHead>
//                     <TableHead>Cliente</TableHead>
//                     <TableHead>Valor</TableHead>
//                     <TableHead>Método</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Data</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredPagamentos.map((pagamento) => (
//                     <TableRow key={pagamento.id}>
//                       <TableCell className="font-medium">{pagamento.id}</TableCell>
//                       <TableCell>{pagamento.cliente}</TableCell>
//                       <TableCell className="font-medium">R$ {pagamento.valor.toFixed(2)}</TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{pagamento.metodo}</Badge>
//                       </TableCell>
//                       <TableCell>{getStatusBadge(pagamento.status)}</TableCell>
//                       <TableCell>{new Date(pagamento.data).toLocaleDateString("pt-BR")}</TableCell>
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
