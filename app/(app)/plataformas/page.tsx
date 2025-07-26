// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Sidebar } from "@/components/layout/sidebar"
// import { Header } from "@/components/layout/header"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Plus, Settings, ExternalLink } from "lucide-react"
// import { isAuthenticated, hasPermission } from "@/lib/auth"

// const mockPlataformas = [
//   {
//     id: "1",
//     nome: "Mercado Livre",
//     tipo: "marketplace",
//     status: "ativo",
//     vendas: 1250,
//     receita: 45000,
//     comissao: 12.5,
//     ultimaSync: "2024-01-15T10:30:00",
//   },
//   {
//     id: "2",
//     nome: "Shopee",
//     tipo: "marketplace",
//     status: "ativo",
//     vendas: 890,
//     receita: 28000,
//     comissao: 8.0,
//     ultimaSync: "2024-01-15T09:45:00",
//   },
//   {
//     id: "3",
//     nome: "Amazon",
//     tipo: "marketplace",
//     status: "inativo",
//     vendas: 0,
//     receita: 0,
//     comissao: 15.0,
//     ultimaSync: null,
//   },
//   {
//     id: "4",
//     nome: "Loja Própria",
//     tipo: "ecommerce",
//     status: "ativo",
//     vendas: 2100,
//     receita: 78000,
//     comissao: 0,
//     ultimaSync: "2024-01-15T11:00:00",
//   },
// ]

// export default function PlataformasPage() {
//   const router = useRouter()
//   const [plataformas] = useState(mockPlataformas)

//   useEffect(() => {
//     if (!isAuthenticated() || !hasPermission("plataformas")) {
//       router.push("/dashboard")
//     }
//   }, [router])

//   const getStatusBadge = (status: string) => {
//     return status === "ativo" ? (
//       <Badge className="bg-green-600">Ativo</Badge>
//     ) : (
//       <Badge variant="secondary">Inativo</Badge>
//     )
//   }

//   const getTipoBadge = (tipo: string) => {
//     return tipo === "marketplace" ? (
//       <Badge variant="outline">Marketplace</Badge>
//     ) : (
//       <Badge className="bg-blue-600">E-commerce</Badge>
//     )
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 lg:ml-64">
//         <Header />
//         <main className="p-6 space-y-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold">Plataformas</h1>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Nova Plataforma
//             </Button>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Plataformas Ativas</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{plataformas.filter((p) => p.status === "ativo").length}</div>
//                 <p className="text-xs text-muted-foreground">de {plataformas.length} total</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {plataformas.reduce((acc, p) => acc + p.vendas, 0).toLocaleString()}
//                 </div>
//                 <p className="text-xs text-muted-foreground">em todas as plataformas</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   R$ {plataformas.reduce((acc, p) => acc + p.receita, 0).toLocaleString()}
//                 </div>
//                 <p className="text-xs text-muted-foreground">em todas as plataformas</p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2">
//             {plataformas.map((plataforma) => (
//               <Card key={plataforma.id}>
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <CardTitle>{plataforma.nome}</CardTitle>
//                       {getTipoBadge(plataforma.tipo)}
//                     </div>
//                     {getStatusBadge(plataforma.status)}
//                   </div>
//                   <CardDescription>
//                     {plataforma.ultimaSync
//                       ? `Última sincronização: ${new Date(plataforma.ultimaSync).toLocaleString("pt-BR")}`
//                       : "Nunca sincronizado"}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm font-medium">Vendas</p>
//                       <p className="text-2xl font-bold">{plataforma.vendas.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium">Receita</p>
//                       <p className="text-2xl font-bold">R$ {plataforma.receita.toLocaleString()}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">Comissão</p>
//                     <p className="text-lg">{plataforma.comissao}%</p>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <Switch checked={plataforma.status === "ativo"} />
//                       <span className="text-sm">Ativo</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Button variant="outline" size="sm">
//                         <Settings className="h-4 w-4" />
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         <ExternalLink className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
