"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Shield, Mail, Bell, Palette, Database, Key, Globe } from "lucide-react"

export default function AdminConfiguracoes() {
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesPush, setNotificacoesPush] = useState(false)
  const [manutencao, setManutencao] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="admin" />

      <div className="flex-1 lg:ml-64">
        <Header userRole="admin" userName="Admin Sistema" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
            <Button>Salvar Alterações</Button>
          </div>

          <Tabs defaultValue="geral" className="space-y-4">
            <TabsList>
              <TabsTrigger value="geral">
                <Settings className="w-4 h-4 mr-2" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="seguranca">
                <Shield className="w-4 h-4 mr-2" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="notificacoes">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="integracao">
                <Globe className="w-4 h-4 mr-2" />
                Integrações
              </TabsTrigger>
              <TabsTrigger value="aparencia">
                <Palette className="w-4 h-4 mr-2" />
                Aparência
              </TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>Configurações básicas da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-empresa">Nome da Empresa</Label>
                      <Input id="nome-empresa" defaultValue="BitWise Agency Ltda" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dominio">Domínio Principal</Label>
                      <Input id="dominio" defaultValue="crmsaas.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição da Empresa</Label>
                    <Textarea
                      id="descricao"
                      defaultValue="Plataforma completa de CRM para distribuidores e revendedores"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone de Suporte</Label>
                      <Input id="telefone" defaultValue="(11) 3000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-suporte">Email de Suporte</Label>
                      <Input id="email-suporte" defaultValue="suporte@crmsaas.com" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Modo Manutenção</Label>
                      <p className="text-sm text-muted-foreground">Ativar para bloquear acesso durante manutenções</p>
                    </div>
                    <Switch checked={manutencao} onCheckedChange={setManutencao} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Comissão</CardTitle>
                  <CardDescription>Defina as taxas de comissão padrão</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="comissao-distribuidor">Comissão Distribuidor (%)</Label>
                      <Input id="comissao-distribuidor" type="number" defaultValue="15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comissao-revendedor">Comissão Revendedor (%)</Label>
                      <Input id="comissao-revendedor" type="number" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bonus-meta">Bônus por Meta (%)</Label>
                      <Input id="bonus-meta" type="number" defaultValue="5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Políticas de Segurança</CardTitle>
                  <CardDescription>Configure as políticas de segurança da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha-min">Tamanho Mínimo da Senha</Label>
                      <Select defaultValue="8">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 caracteres</SelectItem>
                          <SelectItem value="8">8 caracteres</SelectItem>
                          <SelectItem value="10">10 caracteres</SelectItem>
                          <SelectItem value="12">12 caracteres</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessao-timeout">Timeout de Sessão (minutos)</Label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                          <SelectItem value="480">8 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Autenticação de Dois Fatores</Label>
                        <p className="text-sm text-muted-foreground">Obrigar 2FA para todos os usuários</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Log de Auditoria</Label>
                        <p className="text-sm text-muted-foreground">Registrar todas as ações dos usuários</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Bloqueio por Tentativas</Label>
                        <p className="text-sm text-muted-foreground">Bloquear conta após 5 tentativas de login</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chaves de API</CardTitle>
                  <CardDescription>Gerencie as chaves de API do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Chave Principal</p>
                      <p className="text-xs text-muted-foreground">sk_live_*********************</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Key className="w-3 h-3 mr-1" />
                        Regenerar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Chave de Webhook</p>
                      <p className="text-xs text-muted-foreground">whsec_*********************</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Key className="w-3 h-3 mr-1" />
                        Regenerar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacoes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Notificação</CardTitle>
                  <CardDescription>Configure como e quando enviar notificações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">Enviar notificações importantes por email</p>
                    </div>
                    <Switch checked={notificacoesEmail} onCheckedChange={setNotificacoesEmail} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">Enviar notificações push no navegador</p>
                    </div>
                    <Switch checked={notificacoesPush} onCheckedChange={setNotificacoesPush} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-remetente">Email Remetente</Label>
                    <Input id="email-remetente" defaultValue="noreply@crmsaas.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome-remetente">Nome do Remetente</Label>
                    <Input id="nome-remetente" defaultValue="BitWise Agency" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Templates de Email</CardTitle>
                  <CardDescription>Configure os templates de email do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Boas-vindas</p>
                        <p className="text-xs text-muted-foreground">Email enviado para novos usuários</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Recuperação de Senha</p>
                        <p className="text-xs text-muted-foreground">Email para reset de senha</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Cobrança</p>
                        <p className="text-xs text-muted-foreground">Email de cobrança para distribuidores</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integracao" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integrações Ativas</CardTitle>
                  <CardDescription>Gerencie as integrações com serviços externos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">SendGrid</p>
                        <p className="text-xs text-muted-foreground">Envio de emails transacionais</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600">Conectado</span>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                        <Database className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Stripe</p>
                        <p className="text-xs text-muted-foreground">Processamento de pagamentos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600">Conectado</span>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Google Analytics</p>
                        <p className="text-xs text-muted-foreground">Análise de tráfego e conversões</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Desconectado</span>
                      <Button variant="outline" size="sm">
                        Conectar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aparencia" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personalização Visual</CardTitle>
                  <CardDescription>Configure a aparência da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema Principal</Label>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded border-2 border-blue-600 cursor-pointer"></div>
                      <div className="w-8 h-8 bg-green-600 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-purple-600 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-red-600 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-orange-600 rounded border cursor-pointer"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo da Empresa</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">Logo</span>
                      </div>
                      <Button variant="outline">Fazer Upload</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">ICO</span>
                      </div>
                      <Button variant="outline">Fazer Upload</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Modo Escuro</Label>
                      <p className="text-sm text-muted-foreground">Permitir que usuários alternem para modo escuro</p>
                    </div>
                    <Switch defaultChecked={true} />
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
