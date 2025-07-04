import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ShoppingCart, Users, Package, TrendingUp, ArrowUpRight, Store, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function RevendedorDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="revendedor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="revendedor" userName="Maria Santos" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Meu Painel de Vendas</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline">Solicitar Produtos</Button>
              <Button>Nova Venda</Button>
            </div>
          </div>

          {/* Métricas do Revendedor */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 4.250</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +18.5%
                  </span>
                  desde o mês passado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +5 novos
                  </span>
                  este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Disponíveis</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">12 produtos em destaque</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meta do Mês</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">R$ 4.250 de R$ 5.000</p>
                <Progress value={85} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Status da Loja e Vendas Recentes */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Minha Loja Online</CardTitle>
                <CardDescription>Status e configurações da sua loja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Store className="h-4 w-4" />
                      <span className="text-sm">Loja Online</span>
                    </div>
                    <Badge variant="default">Ativa</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Visitantes hoje</span>
                      <span>23</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Conversões</span>
                      <span>4 (17.4%)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Campanha Ativa</p>
                    <p className="text-xs text-blue-600">Desconto de 15% em produtos selecionados</p>
                  </div>

                  <Button className="w-full" size="sm">
                    Gerenciar Loja
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
                <CardDescription>Últimas transações realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">João Silva</p>
                      <p className="text-xs text-muted-foreground">Produto XYZ - 2 unidades</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ 450,00</p>
                      <p className="text-xs text-muted-foreground">há 2 horas</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Ana Costa</p>
                      <p className="text-xs text-muted-foreground">Produto ABC - 1 unidade</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ 280,00</p>
                      <p className="text-xs text-muted-foreground">há 4 horas</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Carlos Oliveira</p>
                      <p className="text-xs text-muted-foreground">Produto DEF - 3 unidades</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ 720,00</p>
                      <p className="text-xs text-muted-foreground">ontem</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Produtos em Destaque e Solicitações */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Produtos em Destaque</CardTitle>
                <CardDescription>Produtos com melhor performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Produto Premium XYZ</p>
                      <p className="text-xs text-muted-foreground">15 vendas este mês</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ 225,00</p>
                      <Badge variant="secondary">Top 1</Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Produto Especial ABC</p>
                      <p className="text-xs text-muted-foreground">12 vendas este mês</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ 180,00</p>
                      <Badge variant="secondary">Top 2</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Funcionalidades mais utilizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-xs">Novo Cliente</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                    <Package className="h-6 w-6 mb-2" />
                    <span className="text-xs">Solicitar Estoque</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span className="text-xs">Ver Relatório</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                    <Store className="h-6 w-6 mb-2" />
                    <span className="text-xs">Configurar Loja</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
