"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isAuthenticated, hasPermission } from "@/lib/auth"

export default function ConfiguracoesPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated() || !hasPermission("configuracoes")) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <Button>Salvar Alterações</Button>
          </div>

          <Tabs defaultValue="geral" className="space-y-4">
            <TabsList>
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="integracao">Integração</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>Configure as informações básicas do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Nome da Empresa</Label>
                      <Input id="empresa" placeholder="Minha Empresa LTDA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input id="cnpj" placeholder="00.000.000/0000-00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Textarea id="endereco" placeholder="Rua, número, bairro, cidade, estado" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" placeholder="(11) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="contato@empresa.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>Gerencie as configurações de segurança do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Automático</Label>
                      <p className="text-sm text-muted-foreground">Manter usuários logados por mais tempo</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessao">Tempo de Sessão (minutos)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="480">8 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacoes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Notificações</CardTitle>
                  <CardDescription>Configure como e quando receber notificações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">Receber notificações importantes por email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações de Vendas</Label>
                      <p className="text-sm text-muted-foreground">Ser notificado sobre novas vendas</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações de Estoque Baixo</Label>
                      <p className="text-sm text-muted-foreground">Alertas quando produtos estão com estoque baixo</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatórios Semanais</Label>
                      <p className="text-sm text-muted-foreground">Receber relatórios semanais por email</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integracao" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Integração</CardTitle>
                  <CardDescription>Configure integrações com serviços externos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook">URL do Webhook</Label>
                    <Input id="webhook" placeholder="https://meusite.com/webhook" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">Chave da API</Label>
                    <Input id="api-key" type="password" placeholder="Sua chave da API" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sincronização Automática</Label>
                      <p className="text-sm text-muted-foreground">Sincronizar dados automaticamente</p>
                    </div>
                    <Switch />
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
