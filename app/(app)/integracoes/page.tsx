// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Sidebar } from "@/components/layout/sidebar"
// import { Header } from "@/components/layout/header"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Plus, Settings, Zap, Mail, CreditCard, Truck } from "lucide-react"
// import { isAuthenticated, hasPermission } from "@/lib/auth"

// const mockIntegracoes = [
//   {
//     id: "1",
//     nome: "WhatsApp Business",
//     categoria: "comunicacao",
//     status: "ativo",
//     descricao: "Envio de mensagens automáticas para clientes",
//     icon: Mail,
//     configurado: true,
//   },
//   {
//     id: "2",
//     nome: "PagSeguro",
//     categoria: "pagamento",
//     status: "ativo",
//     descricao: "Gateway de pagamento para processar transações",
//     icon: CreditCard,
//     configurado: true,
//   },
//   {
//     id: "3",
//     nome: "Correios",
//     categoria: "logistica",
//     status: "inativo",
//     descricao: "Cálculo de frete e rastreamento de encomendas",
//     icon: Truck,
//     configurado: false,
//   },
//   {
//     id: "4",
//     nome: "Zapier",
//     categoria: "automacao",
//     status: "ativo",
//     descricao: "Automação de processos entre diferentes aplicações",
//     icon: Zap,
//     configurado: true,
//   },
//   {
//     id: "5",
//     nome: "Mercado Pago",
//     categoria: "pagamento",
//     status: "inativo",
//     descricao: "Gateway de pagamento alternativo",
//     icon: CreditCard,
//     configurado: false,
//   },
//   {
//     id: "6",
//     nome: "RD Station",
//     categoria: "marketing",
//     status: "ativo",
//     descricao: "Automação de marketing e gestão de leads",
//     icon: Mail,
//     configurado: true,
//   },
// ]

// export default function IntegracoesPage() {
//   const router = useRouter()
//   const [integracoes] = useState(mockIntegracoes)

//   useEffect(() => {
//     if (!isAuthenticated() || !hasPermission("integracoes")) {
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

//   const getCategoriaBadge = (categoria: string) => {
//     const colors = {
//       comunicacao: "bg-blue-600",
//       pagamento: "bg-green-600",
//       logistica: "bg-orange-600",
//       automacao: "bg-purple-600",
//       marketing: "bg-pink-600",
//     }
//     return <Badge className={colors[categoria as keyof typeof colors]}>{categoria}</Badge>
//   }

//   const integracoesAtivas = integracoes.filter((i) => i.status === "ativo").length
//   const integracoesConfiguradas = integracoes.filter((i) => i.configurado).length

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 lg:ml-64">
//         <Header />
//         <main className="p-6 space-y-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold">Integrações</h1>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Nova Integração
//             </Button>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
//                 <Zap className="h-4 w-4 text-green-600" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{integracoesAtivas}</div>
//                 <p className="text-xs text-muted-foreground">de {integracoes.length} disponíveis</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Configuradas</CardTitle>
//                 <Settings className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{integracoesConfiguradas}</div>
//                 <p className="text-xs text-muted-foreground">prontas para uso</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
//                 <Zap className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">98.5%</div>
//                 <p className="text-xs text-muted-foreground">nas últimas 24h</p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {integracoes.map((integracao) => {
//               const Icon = integracao.icon
//               return (
//                 <Card key={integracao.id}>
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div className="p-2 bg-gray-100 rounded-lg">
//                           <Icon className="h-6 w-6" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-lg">{integracao.nome}</CardTitle>
//                           {getCategoriaBadge(integracao.categoria)}
//                         </div>
//                       </div>
//                       {getStatusBadge(integracao.status)}
//                     </div>
//                     <CardDescription>{integracao.descricao}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <Switch checked={integracao.status === "ativo"} />
//                         <span className="text-sm">Ativo</span>
//                       </div>
//                       <Badge variant={integracao.configurado ? "default" : "secondary"}>
//                         {integracao.configurado ? "Configurado" : "Não configurado"}
//                       </Badge>
//                     </div>
//                     <div className="flex justify-end">
//                       <Button variant="outline" size="sm">
//                         <Settings className="mr-2 h-4 w-4" />
//                         Configurar
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
