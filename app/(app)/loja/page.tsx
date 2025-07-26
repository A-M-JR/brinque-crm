"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, Globe, Eye, BarChart3 } from "lucide-react"
import { isAuthenticated, hasPermission } from "@/lib/auth"

export default function LojaPage() {
  const router = useRouter()
  const [lojaAtiva, setLojaAtiva] = useState(true)
  const [nomeLojaValue, setNomeLojaValue] = useState("Minha Loja Online")
  const [descricaoValue, setDescricaoValue] = useState(
    "Bem-vindo à nossa loja online! Encontre os melhores produtos com qualidade garantida.",
  )

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    if (!hasPermission("loja")) {
      router.push("/dashboard")
      return
    }
  }, [router])

  if (!isAuthenticated() || !hasPermission("loja")) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Minha Loja</h2>
              <p className="text-muted-foreground">Configure e gerencie sua loja online</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar Loja
              </Button>
              <Button>
                <Globe className="mr-2 h-4 w-4" />
                Publicar
              </Button>
            </div>
          </div>

          {/* Status da Loja */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Status da Loja</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Loja Online</p>
                  <p className="text-sm text-muted-foreground">
                    {lojaAtiva ? "Sua loja está ativa e recebendo visitantes" : "Sua loja está desativada"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="loja-status">Ativar Loja</Label>
                  <Switch id="loja-status" checked={lojaAtiva} onCheckedChange={setLojaAtiva} />
                  <Badge variant={lojaAtiva ? "default" : "secondary"}>{lojaAtiva ? "Ativa" : "Inativa"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas da Loja */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitantes Hoje</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+15% desde ontem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">17.4% taxa de conversão</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Online</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 1.250</div>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">De 15 produtos</p>
              </CardContent>
            </Card>
          </div>

          {/* Configurações da Loja */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Loja</CardTitle>
              <CardDescription>Personalize sua loja online</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="geral" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="geral">Geral</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="produtos">Produtos</TabsTrigger>
                  <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
                </TabsList>

                <TabsContent value="geral" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-loja">Nome da Loja</Label>
                      <Input
                        id="nome-loja"
                        value={nomeLojaValue}
                        onChange={(e) => setNomeLojaValue(e.target.value)}
                        placeholder="Digite o nome da sua loja"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricao-loja">Descrição</Label>
                      <Textarea
                        id="descricao-loja"
                        value={descricaoValue}
                        onChange={(e) => setDescricaoValue(e.target.value)}
                        placeholder="Descreva sua loja"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url-loja">URL da Loja</Label>
                      <Input id="url-loja" value="minhaloja.crmsaas.com" disabled className="bg-gray-50" />
                      <p className="text-xs text-muted-foreground">Esta é sua URL personalizada</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Tema da Loja</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="cursor-pointer border-2 border-blue-500">
                          <CardContent className="p-4">
                            <div className="h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded mb-2"></div>
                            <p className="text-sm font-medium">Azul Moderno</p>
                          </CardContent>
                        </Card>
                        <Card className="cursor-pointer">
                          <CardContent className="p-4">
                            <div className="h-20 bg-gradient-to-br from-green-500 to-green-600 rounded mb-2"></div>
                            <p className="text-sm font-medium">Verde Natural</p>
                          </CardContent>
                        </Card>
                        <Card className="cursor-pointer">
                          <CardContent className="p-4">
                            <div className="h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded mb-2"></div>
                            <p className="text-sm font-medium">Roxo Elegante</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo da Loja</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <p className="text-sm text-muted-foreground">Clique para fazer upload do logo</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="produtos" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Produtos na Loja</h3>
                        <p className="text-sm text-muted-foreground">Gerencie quais produtos aparecem na sua loja</p>
                      </div>
                      <Button>Gerenciar Produtos</Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Produto Premium XYZ</p>
                          <p className="text-sm text-muted-foreground">R$ 225,00</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Produto Especial ABC</p>
                          <p className="text-sm text-muted-foreground">R$ 180,00</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Produto Standard DEF</p>
                          <p className="text-sm text-muted-foreground">R$ 240,00</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pagamento" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Métodos de Pagamento</h3>
                      <p className="text-sm text-muted-foreground">Configure como seus clientes podem pagar</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">💳</div>
                          <div>
                            <p className="font-medium">Cartão de Crédito</p>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, Elo</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">🏦</div>
                          <div>
                            <p className="font-medium">PIX</p>
                            <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">📄</div>
                          <div>
                            <p className="font-medium">Boleto Bancário</p>
                            <p className="text-sm text-muted-foreground">Vencimento em 3 dias</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
