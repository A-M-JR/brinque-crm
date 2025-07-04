import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ShoppingCart, Users, Package, ArrowUpRight, Store, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function DistribuidorDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="distribuidor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="distribuidor" userName="João Silva" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard do Distribuidor</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline">Ver Relatório</Button>
              <Button>Nova Campanha</Button>
            </div>
          </div>

          {/* Métricas do Distribuidor */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 12.847</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +15.2%
                  </span>
                  desde o mês passado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revendedores Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2 novos
                  </span>
                  este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-600">12 produtos com estoque baixo</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Capturados</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +7 hoje
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance dos Revendedores */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Performance dos Revendedores</CardTitle>
                <CardDescription>Top 5 revendedores do mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Maria Santos</p>
                        <p className="text-sm text-muted-foreground">R$ 4.250</p>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <Badge variant="secondary">1º</Badge>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Carlos Oliveira</p>
                        <p className="text-sm text-muted-foreground">R$ 3.890</p>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <Badge variant="secondary">2º</Badge>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Ana Costa</p>
                        <p className="text-sm text-muted-foreground">R$ 3.120</p>
                      </div>
                      <Progress value={58} className="h-2" />
                    </div>
                    <Badge variant="secondary">3º</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Status da Loja</CardTitle>
                <CardDescription>Configuração da sua loja online</CardDescription>
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
                      <span>Produtos cadastrados</span>
                      <span>45/50</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Campanhas ativas</span>
                      <span>3</span>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Gerenciar Loja
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas e Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas e Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border rounded-lg bg-yellow-50">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Estoque baixo</p>
                    <p className="text-xs text-muted-foreground">12 produtos precisam de reposição</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver produtos
                  </Button>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg bg-blue-50">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Novo revendedor</p>
                    <p className="text-xs text-muted-foreground">Pedro Lima solicitou cadastro como revendedor</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Aprovar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
