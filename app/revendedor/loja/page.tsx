"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Store,
  Palette,
  Settings,
  Eye,
  Share2,
  BarChart3,
  Users,
  ShoppingCart,
  TrendingUp,
  ExternalLink,
} from "lucide-react"

export default function RevendedorLoja() {
  const [lojaAtiva, setLojaAtiva] = useState(true)
  const [nomeLojaValue, setNomeLojaValue] = useState("Loja da Maria Santos")
  const [descricaoValue, setDescricaoValue] = useState("Os melhores produtos com atendimento personalizado")

  const abrirLoja = () => {
    window.open("/loja/loja-maria-santos", "_blank")
  }

  const compartilharLoja = () => {
    const url = `${window.location.origin}/loja/loja-maria-santos`
    navigator.clipboard.writeText(url)
    alert("Link da loja copiado para a área de transferência!")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="revendedor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="revendedor" userName="Maria Santos" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Minha Loja Online</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={abrirLoja}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar Loja
              </Button>
              <Button onClick={compartilharLoja}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Status da Loja */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status da Loja</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant={lojaAtiva ? "default" : "secondary"}>{lojaAtiva ? "Ativa" : "Inativa"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">URL: loja-maria-santos.crmsaas.com</p>
                <Button variant="link" className="p-0 h-auto text-xs mt-1" onClick={abrirLoja}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Abrir loja
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitantes Hoje</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">+25% desde ontem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">R$ 670,00 em vendas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20.0%</div>
                <p className="text-xs text-muted-foreground">3 de 15 visitantes</p>
              </CardContent>
            </Card>
          </div>

          {/* Configurações da Loja */}
          <Tabs defaultValue="configuracoes" className="space-y-4">
            <TabsList>
              <TabsTrigger value="configuracoes">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="aparencia">
                <Palette className="w-4 h-4 mr-2" />
                Aparência
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="configuracoes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>Configure as informações básicas da sua loja</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Loja Ativa</Label>
                      <p className="text-sm text-muted-foreground">Ative ou desative sua loja online</p>
                    </div>
                    <Switch checked={lojaAtiva} onCheckedChange={setLojaAtiva} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-loja">Nome da Loja</Label>
                      <Input id="nome-loja" value={nomeLojaValue} onChange={(e) => setNomeLojaValue(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url-loja">URL da Loja</Label>
                      <Input id="url-loja" value="loja-maria-santos" disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={descricaoValue}
                      onChange={(e) => setDescricaoValue(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone de Contato</Label>
                      <Input id="telefone" placeholder="(11) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email de Contato</Label>
                      <Input id="email" placeholder="contato@loja.com" />
                    </div>
                  </div>

                  <Button>Salvar Configurações</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aparencia" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personalização Visual</CardTitle>
                  <CardDescription>Customize a aparência da sua loja</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Cor Principal</Label>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded border-2 border-blue-600"></div>
                        <div className="w-8 h-8 bg-green-600 rounded border"></div>
                        <div className="w-8 h-8 bg-purple-600 rounded border"></div>
                        <div className="w-8 h-8 bg-red-600 rounded border"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Layout</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 border rounded bg-white">
                          <div className="h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-gray-100 rounded"></div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo da Loja</Label>
                      <Button variant="outline" className="w-full bg-transparent">
                        Fazer Upload
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner">Banner Principal</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-sm text-muted-foreground">Clique para fazer upload do banner (1200x400px)</p>
                    </div>
                  </div>

                  <Button>Salvar Aparência</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tráfego da Loja</CardTitle>
                    <CardDescription>Visitantes nos últimos 7 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Gráfico de tráfego será implementado aqui
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Mais Vistos</CardTitle>
                    <CardDescription>Top 5 produtos com mais visualizações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Produto Premium XYZ</span>
                        <span className="text-sm font-medium">45 visualizações</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Produto Especial ABC</span>
                        <span className="text-sm font-medium">32 visualizações</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Produto Deluxe GHI</span>
                        <span className="text-sm font-medium">28 visualizações</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Produto Básico DEF</span>
                        <span className="text-sm font-medium">18 visualizações</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Produto Standard JKL</span>
                        <span className="text-sm font-medium">12 visualizações</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Origem dos Visitantes</CardTitle>
                  <CardDescription>De onde vêm seus visitantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">60%</div>
                      <p className="text-sm text-muted-foreground">Busca Orgânica</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">25%</div>
                      <p className="text-sm text-muted-foreground">Redes Sociais</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">15%</div>
                      <p className="text-sm text-muted-foreground">Direto</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
