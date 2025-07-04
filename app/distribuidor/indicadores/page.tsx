"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, DollarSign, Target, Award, Download } from "lucide-react"

export default function DistribuidorIndicadores() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="distribuidor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="distribuidor" userName="João Silva" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Indicadores de Performance</h2>
            <div className="flex items-center space-x-2">
              <Select defaultValue="30dias">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          <Tabs defaultValue="vendas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="vendas">
                <BarChart3 className="w-4 h-4 mr-2" />
                Vendas
              </TabsTrigger>
              <TabsTrigger value="revendedores">
                <Users className="w-4 h-4 mr-2" />
                Revendedores
              </TabsTrigger>
              <TabsTrigger value="metas">
                <Target className="w-4 h-4 mr-2" />
                Metas
              </TabsTrigger>
              <TabsTrigger value="comissoes">
                <DollarSign className="w-4 h-4 mr-2" />
                Comissões
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vendas" className="space-y-4">
              {/* KPIs de Vendas */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 12.847</div>
                    <p className="text-xs text-muted-foreground">+15.2% vs mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 89,50</div>
                    <p className="text-xs text-muted-foreground">+3.1% vs mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversão</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18.5%</div>
                    <p className="text-xs text-muted-foreground">+2.3% vs mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">143</div>
                    <p className="text-xs text-muted-foreground">+8.7% vs mês anterior</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de Vendas */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução das Vendas</CardTitle>
                    <CardDescription>Vendas por semana nos últimos 30 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Gráfico de evolução das vendas será implementado aqui
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Produtos</CardTitle>
                    <CardDescription>Produtos mais vendidos no período</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Produto Premium XYZ</p>
                          <p className="text-xs text-muted-foreground">45 vendas</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={90} className="w-16 h-2" />
                          <Badge variant="default">1º</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Produto Especial ABC</p>
                          <p className="text-xs text-muted-foreground">32 vendas</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={64} className="w-16 h-2" />
                          <Badge variant="secondary">2º</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Produto Deluxe GHI</p>
                          <p className="text-xs text-muted-foreground">28 vendas</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={56} className="w-16 h-2" />
                          <Badge variant="outline">3º</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revendedores" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Ranking de Performance</CardTitle>
                    <CardDescription>Top revendedores do mês</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">Maria Santos</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">R$ 4.250</p>
                          <p className="text-xs text-muted-foreground">85% da meta</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Pedro Lima</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">R$ 3.890</p>
                          <p className="text-xs text-muted-foreground">97% da meta</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Lucia Costa</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">R$ 2.100</p>
                          <p className="text-xs text-muted-foreground">70% da meta</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Crescimento da Rede</CardTitle>
                    <CardDescription>Evolução do número de revendedores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">23</div>
                        <p className="text-sm text-muted-foreground">Revendedores ativos</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Janeiro</span>
                          <span>+2 novos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Dezembro</span>
                          <span>+1 novo</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Novembro</span>
                          <span>+3 novos</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Produtividade</CardTitle>
                    <CardDescription>Média de vendas por revendedor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">R$ 558</div>
                        <p className="text-sm text-muted-foreground">Média por revendedor</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Melhor performance</span>
                          <span>R$ 4.250</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Média geral</span>
                          <span>R$ 2.747</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Meta individual</span>
                          <span>R$ 3.000</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metas" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Metas vs Realizado</CardTitle>
                    <CardDescription>Performance contra metas estabelecidas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Vendas Mensais</span>
                          <span className="text-sm">R$ 12.847 / R$ 15.000</span>
                        </div>
                        <Progress value={85.6} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-1">85.6% da meta</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Novos Clientes</span>
                          <span className="text-sm">18 / 25</span>
                        </div>
                        <Progress value={72} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-1">72% da meta</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Produtos Vendidos</span>
                          <span className="text-sm">143 / 180</span>
                        </div>
                        <Progress value={79.4} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-1">79.4% da meta</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Metas dos Revendedores</CardTitle>
                    <CardDescription>Acompanhamento individual das metas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maria Santos</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={85} className="w-20 h-2" />
                          <span className="text-xs">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pedro Lima</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={97} className="w-20 h-2" />
                          <span className="text-xs">97%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Lucia Costa</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={70} className="w-20 h-2" />
                          <span className="text-xs">70%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Roberto Silva</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={60} className="w-20 h-2" />
                          <span className="text-xs">60%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comissoes" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Comissões do Mês</CardTitle>
                    <CardDescription>Suas comissões e da rede</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-blue-800">Sua Comissão</p>
                          <p className="text-xs text-blue-600">15% sobre vendas</p>
                        </div>
                        <span className="text-lg font-bold text-blue-800">R$ 1.927</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-green-800">Comissão da Rede</p>
                          <p className="text-xs text-green-600">5% sobre vendas dos revendedores</p>
                        </div>
                        <span className="text-lg font-bold text-green-800">R$ 642</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-purple-800">Bônus por Meta</p>
                          <p className="text-xs text-purple-600">Meta de 85% atingida</p>
                        </div>
                        <span className="text-lg font-bold text-purple-800">R$ 320</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Pagamentos</CardTitle>
                    <CardDescription>Últimos pagamentos recebidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Dezembro 2023</p>
                          <p className="text-xs text-muted-foreground">Pago em 05/01/2024</p>
                        </div>
                        <span className="text-sm font-medium">R$ 2.450</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Novembro 2023</p>
                          <p className="text-xs text-muted-foreground">Pago em 05/12/2023</p>
                        </div>
                        <span className="text-sm font-medium">R$ 2.180</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Outubro 2023</p>
                          <p className="text-xs text-muted-foreground">Pago em 05/11/2023</p>
                        </div>
                        <span className="text-sm font-medium">R$ 1.890</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projeção</CardTitle>
                    <CardDescription>Estimativa para o próximo pagamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">R$ 2.889</div>
                        <p className="text-sm text-muted-foreground">Estimativa para Janeiro</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Data de pagamento</span>
                          <span>05/02/2024</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Dias restantes</span>
                          <span>12 dias</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
