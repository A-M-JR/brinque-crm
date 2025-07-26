"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, DollarSign, Download, Target, Award } from "lucide-react"

export default function AdminRelatorios() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="admin" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="admin" userName="Admin Sistema" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Relatórios e Analytics</h2>
            <div className="flex items-center space-x-2">
              <Select defaultValue="30dias">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                  <SelectItem value="ano">Este ano</SelectItem>
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
              <TabsTrigger value="usuarios">
                <Users className="w-4 h-4 mr-2" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="financeiro">
                <DollarSign className="w-4 h-4 mr-2" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="performance">
                <Target className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vendas" className="space-y-4">
              {/* Métricas de Vendas */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">+18.2% vs mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 89.247</div>
                    <p className="text-xs text-muted-foreground">+12.5% vs mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 71,58</div>
                    <p className="text-xs text-muted-foreground">-2.1% vs mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.8%</div>
                    <p className="text-xs text-muted-foreground">+3.2% vs mês anterior</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de Vendas */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Vendas por Período</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Gráfico de vendas por período será implementado aqui
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Top Produtos</CardTitle>
                    <CardDescription>Produtos mais vendidos no período</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Produto Premium XYZ</p>
                          <p className="text-xs text-muted-foreground">245 vendas</p>
                        </div>
                        <Badge variant="default">1º</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Produto Especial ABC</p>
                          <p className="text-xs text-muted-foreground">189 vendas</p>
                        </div>
                        <Badge variant="secondary">2º</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Produto Deluxe GHI</p>
                          <p className="text-xs text-muted-foreground">156 vendas</p>
                        </div>
                        <Badge variant="outline">3º</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="usuarios" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuidores</CardTitle>
                    <CardDescription>Performance dos distribuidores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">João Silva</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={85} className="w-16 h-2" />
                          <span className="text-xs">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Carlos Mendes</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={72} className="w-16 h-2" />
                          <span className="text-xs">72%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ana Paula</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={68} className="w-16 h-2" />
                          <span className="text-xs">68%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Revendedores</CardTitle>
                    <CardDescription>Revendedores com melhor performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Maria Santos</p>
                          <p className="text-xs text-muted-foreground">R$ 4.250 em vendas</p>
                        </div>
                        <Award className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Pedro Lima</p>
                          <p className="text-xs text-muted-foreground">R$ 3.890 em vendas</p>
                        </div>
                        <Award className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Lucia Costa</p>
                          <p className="text-xs text-muted-foreground">R$ 3.120 em vendas</p>
                        </div>
                        <Award className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Crescimento</CardTitle>
                    <CardDescription>Novos usuários por mês</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Janeiro</span>
                        <span className="text-sm font-medium">+12 usuários</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dezembro</span>
                        <span className="text-sm font-medium">+8 usuários</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Novembro</span>
                        <span className="text-sm font-medium">+15 usuários</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Fluxo de Caixa</CardTitle>
                    <CardDescription>Entradas e saídas do período</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-green-800">Receitas</p>
                          <p className="text-xs text-green-600">Vendas + Comissões</p>
                        </div>
                        <span className="text-lg font-bold text-green-800">R$ 89.247</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-red-800">Despesas</p>
                          <p className="text-xs text-red-600">Operacionais + Marketing</p>
                        </div>
                        <span className="text-lg font-bold text-red-800">R$ 23.450</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-blue-800">Lucro Líquido</p>
                          <p className="text-xs text-blue-600">Receitas - Despesas</p>
                        </div>
                        <span className="text-lg font-bold text-blue-800">R$ 65.797</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Comissões</CardTitle>
                    <CardDescription>Comissões pagas no período</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Distribuidores</span>
                        <span className="text-sm font-medium">R$ 12.450</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Revendedores</span>
                        <span className="text-sm font-medium">R$ 8.920</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bonificações</span>
                        <span className="text-sm font-medium">R$ 2.180</span>
                      </div>
                      <hr />
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-sm">Total</span>
                        <span className="text-sm">R$ 23.550</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Metas vs Realizado</CardTitle>
                    <CardDescription>Performance geral da plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Vendas</span>
                          <span className="text-sm">1.247 / 1.500</span>
                        </div>
                        <Progress value={83} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">83% da meta</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Receita</span>
                          <span className="text-sm">R$ 89k / R$ 100k</span>
                        </div>
                        <Progress value={89} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">89% da meta</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Novos Clientes</span>
                          <span className="text-sm">156 / 200</span>
                        </div>
                        <Progress value={78} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">78% da meta</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Indicadores Chave</CardTitle>
                    <CardDescription>KPIs principais do negócio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">CAC (Custo Aquisição)</span>
                        <span className="text-sm font-medium">R$ 45,20</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">LTV (Lifetime Value)</span>
                        <span className="text-sm font-medium">R$ 890,50</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Churn Rate</span>
                        <span className="text-sm font-medium">2.3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ROI Marketing</span>
                        <span className="text-sm font-medium">4.2x</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Satisfação</CardTitle>
                    <CardDescription>Índices de satisfação dos usuários</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">4.8</div>
                        <p className="text-sm text-muted-foreground">Nota média geral</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">5 estrelas</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={75} className="w-16 h-2" />
                            <span className="text-xs">75%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">4 estrelas</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={20} className="w-16 h-2" />
                            <span className="text-xs">20%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">3 estrelas</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={5} className="w-16 h-2" />
                            <span className="text-xs">5%</span>
                          </div>
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
