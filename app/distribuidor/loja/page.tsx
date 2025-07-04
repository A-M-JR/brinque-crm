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
  Plus,
  ExternalLink,
} from "lucide-react"

export default function DistribuidorLoja() {
  const [lojaAtiva, setLojaAtiva] = useState(true)
  const [nomeLojaValue, setNomeLojaValue] = useState("Loja do João Silva")
  const [descricaoValue, setDescricaoValue] = useState("Sua loja online com os melhores produtos")

  const abrirLoja = () => {
    window.open("/loja/loja-julio-silva", "_blank")
  }

  const compartilharLoja = () => {
    const url = `${window.location.origin}/loja/loja-julio-silva`
    navigator.clipboard.writeText(url)
    alert("Link da loja copiado para a área de transferência!")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="distribuidor" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="distribuidor" userName="João Silva" />

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
                <p className="text-xs text-muted-foreground mt-2">URL: loja-julio-silva.crmsaas.com</p>
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
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+15% desde ontem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">R$ 890,00 em vendas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">17.4%</div>
                <p className="text-xs text-muted-foreground">4 de 23 visitantes</p>
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
              <TabsTrigger value="campanhas">
                <BarChart3 className="w-4 h-4 mr-2" />
                Campanhas
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
                      <Input id="url-loja" value="loja-julio-silva" disabled />
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

            <TabsContent value="campanhas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campanhas e Promoções</CardTitle>
                  <CardDescription>Gerencie suas campanhas promocionais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Desconto de 15%</h4>
                      <p className="text-sm text-muted-foreground">Válido até 31/01/2024 - Produtos selecionados</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Ativa</Badge>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Frete Grátis</h4>
                      <p className="text-sm text-muted-foreground">Compras acima de R$ 200,00</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Pausada</Badge>
                      <Button variant="outline" size="sm">
                        Ativar
                      </Button>
                    </div>
                  </div>

                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Campanha
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
