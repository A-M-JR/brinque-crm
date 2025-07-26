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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Users,
  CreditCard,
  Building2,
  Upload,
  Download,
  Trash2,
  Edit,
  Plus,
  Check,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminConfiguracoes() {
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesPush, setNotificacoesPush] = useState(false)
  const [manutencao, setManutencao] = useState(false)
  const [backup2FA, setBackup2FA] = useState(true)
  const [auditoria, setAuditoria] = useState(true)
  const [bloqueioTentativas, setBloqueioTentativas] = useState(true)
  const [modoEscuro, setModoEscuro] = useState(true)

  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: "João Silva", email: "joao@empresa.com", role: "admin", status: "ativo", ultimoLogin: "2024-01-15" },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@empresa.com",
      role: "distribuidor",
      status: "ativo",
      ultimoLogin: "2024-01-14",
    },
    {
      id: 3,
      nome: "Pedro Costa",
      email: "pedro@empresa.com",
      role: "revendedor",
      status: "inativo",
      ultimoLogin: "2024-01-10",
    },
  ])

  const [plataformas, setPlataformas] = useState([
    { id: 1, nome: "Mercado Livre", status: "conectado", vendas: 1250, comissao: 12.5 },
    { id: 2, nome: "Amazon", status: "conectado", vendas: 890, comissao: 15.0 },
    { id: 3, nome: "Shopee", status: "desconectado", vendas: 0, comissao: 10.0 },
    { id: 4, nome: "Magazine Luiza", status: "conectado", vendas: 456, comissao: 8.5 },
  ])

  const [backups, setBackups] = useState([
    { id: 1, data: "2024-01-15 02:00", tamanho: "2.5 GB", status: "sucesso" },
    { id: 2, data: "2024-01-14 02:00", tamanho: "2.4 GB", status: "sucesso" },
    { id: 3, data: "2024-01-13 02:00", tamanho: "2.3 GB", status: "falha" },
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header userRole="admin" userName="Admin Sistema" />

        <main className="flex-1 space-y-4 p-4 lg:p-8">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Configurações da Plataforma</h2>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button>Salvar Alterações</Button>
              <Button variant="outline">Exportar Configurações</Button>
            </div>
          </div>

          <Tabs defaultValue="geral" className="space-y-4">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 min-w-max">
                <TabsTrigger value="geral" className="flex items-center space-x-1 text-xs sm:text-sm">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Geral</span>
                </TabsTrigger>
                <TabsTrigger value="usuarios" className="flex items-center space-x-1 text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Usuários</span>
                </TabsTrigger>
                <TabsTrigger value="seguranca" className="flex items-center space-x-1 text-xs sm:text-sm">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Segurança</span>
                </TabsTrigger>
                <TabsTrigger value="notificacoes" className="flex items-center space-x-1 text-xs sm:text-sm">
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Notificações</span>
                </TabsTrigger>
                <TabsTrigger value="plataformas" className="flex items-center space-x-1 text-xs sm:text-sm">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Plataformas</span>
                </TabsTrigger>
                <TabsTrigger value="pagamentos" className="flex items-center space-x-1 text-xs sm:text-sm">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Pagamentos</span>
                </TabsTrigger>
                <TabsTrigger value="backup" className="flex items-center space-x-1 text-xs sm:text-sm">
                  <Database className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Backup</span>
                </TabsTrigger>
                <TabsTrigger value="aparencia" className="flex items-center space-x-1 text-xs sm:text-sm">
                  <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Aparência</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="geral" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Empresa</CardTitle>
                    <CardDescription>Configurações básicas da plataforma</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome-empresa">Nome da Empresa</Label>
                        <Input id="nome-empresa" defaultValue="CRM SaaS Ltda" />
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone de Suporte</Label>
                        <Input id="telefone" defaultValue="(11) 3000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-suporte">Email de Suporte</Label>
                        <Input id="email-suporte" defaultValue="suporte@crmsaas.com" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Sistema</CardTitle>
                    <CardDescription>Configurações operacionais da plataforma</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Modo Manutenção</Label>
                        <p className="text-sm text-muted-foreground">Ativar para bloquear acesso durante manutenções</p>
                      </div>
                      <Switch checked={manutencao} onCheckedChange={setManutencao} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select defaultValue="america/sao_paulo">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america/sao_paulo">América/São Paulo (UTC-3)</SelectItem>
                          <SelectItem value="america/new_york">América/Nova York (UTC-5)</SelectItem>
                          <SelectItem value="europe/london">Europa/Londres (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idioma">Idioma Padrão</Label>
                      <Select defaultValue="pt-br">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                          <SelectItem value="en-us">English (US)</SelectItem>
                          <SelectItem value="es-es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Comissão</CardTitle>
                  <CardDescription>Defina as taxas de comissão padrão para diferentes níveis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="taxa-plataforma">Taxa da Plataforma (%)</Label>
                      <Input id="taxa-plataforma" type="number" defaultValue="2.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usuarios" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle>Gerenciamento de Usuários</CardTitle>
                    <CardDescription>Gerencie usuários e suas permissões</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                        <DialogDescription>Preencha os dados do novo usuário</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome Completo</Label>
                          <Input id="nome" placeholder="Digite o nome completo" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="Digite o email" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Função</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a função" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="distribuidor">Distribuidor</SelectItem>
                              <SelectItem value="revendedor">Revendedor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Criar Usuário</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="space-y-4">
                      {usuarios.map((usuario) => (
                        <div
                          key={usuario.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-2 sm:space-y-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{usuario.nome}</p>
                              <p className="text-xs text-muted-foreground">{usuario.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={usuario.role === "admin" ? "default" : "secondary"}>
                                  {usuario.role}
                                </Badge>
                                <Badge variant={usuario.status === "ativo" ? "default" : "destructive"}>
                                  {usuario.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-xs text-muted-foreground">Último login: {usuario.ultimoLogin}</p>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o usuário {usuario.nome}? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction>Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plataformas" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle>Plataformas de Venda</CardTitle>
                    <CardDescription>Gerencie integrações com marketplaces</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Integração
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {plataformas.map((plataforma) => (
                      <Card key={plataforma.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium">{plataforma.nome}</h3>
                            <Badge variant={plataforma.status === "conectado" ? "default" : "secondary"}>
                              {plataforma.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Vendas:</span>
                              <span>{plataforma.vendas}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Comissão:</span>
                              <span>{plataforma.comissao}%</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Configurar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Backup</CardTitle>
                    <CardDescription>Configure backups automáticos do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequencia-backup">Frequência de Backup</Label>
                      <Select defaultValue="diario">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diário</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="horario-backup">Horário do Backup</Label>
                      <Input id="horario-backup" type="time" defaultValue="02:00" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retencao">Período de Retenção (dias)</Label>
                      <Input id="retencao" type="number" defaultValue="30" />
                    </div>

                    <div className="flex space-x-2">
                      <Button>Fazer Backup Agora</Button>
                      <Button variant="outline">Testar Configuração</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Backups</CardTitle>
                    <CardDescription>Últimos backups realizados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {backups.map((backup) => (
                        <div
                          key={backup.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded space-y-2 sm:space-y-0"
                        >
                          <div>
                            <p className="text-sm font-medium">{backup.data}</p>
                            <p className="text-xs text-muted-foreground">Tamanho: {backup.tamanho}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={backup.status === "sucesso" ? "default" : "destructive"}>
                              {backup.status === "sucesso" ? (
                                <Check className="w-3 h-3 mr-1" />
                              ) : (
                                <X className="w-3 h-3 mr-1" />
                              )}
                              {backup.status}
                            </Badge>
                            {backup.status === "sucesso" && (
                              <Button variant="outline" size="sm">
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seguranca" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Políticas de Segurança</CardTitle>
                  <CardDescription>Configure as políticas de segurança da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <Switch checked={backup2FA} onCheckedChange={setBackup2FA} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Log de Auditoria</Label>
                        <p className="text-sm text-muted-foreground">Registrar todas as ações dos usuários</p>
                      </div>
                      <Switch checked={auditoria} onCheckedChange={setAuditoria} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Bloqueio por Tentativas</Label>
                        <p className="text-sm text-muted-foreground">Bloquear conta após 5 tentativas de login</p>
                      </div>
                      <Switch checked={bloqueioTentativas} onCheckedChange={setBloqueioTentativas} />
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
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

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-remetente">Email Remetente</Label>
                      <Input id="email-remetente" defaultValue="noreply@crmsaas.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome-remetente">Nome do Remetente</Label>
                      <Input id="nome-remetente" defaultValue="CRM SaaS" />
                    </div>
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
                    {[
                      { nome: "Boas-vindas", descricao: "Email enviado para novos usuários" },
                      { nome: "Recuperação de Senha", descricao: "Email para reset de senha" },
                      { nome: "Cobrança", descricao: "Email de cobrança para distribuidores" },
                      { nome: "Novo Pedido", descricao: "Notificação de novo pedido" },
                      { nome: "Pagamento Aprovado", descricao: "Confirmação de pagamento" },
                    ].map((template, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg space-y-2 sm:space-y-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{template.nome}</p>
                          <p className="text-xs text-muted-foreground">{template.descricao}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pagamentos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Pagamento</CardTitle>
                  <CardDescription>Configure métodos de pagamento e taxas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gateway-principal">Gateway Principal</Label>
                      <Select defaultValue="stripe">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                          <SelectItem value="pagseguro">PagSeguro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moeda">Moeda Padrão</Label>
                      <Select defaultValue="brl">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brl">Real (BRL)</SelectItem>
                          <SelectItem value="usd">Dólar (USD)</SelectItem>
                          <SelectItem value="eur">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxa-cartao">Taxa Cartão (%)</Label>
                      <Input id="taxa-cartao" type="number" defaultValue="3.5" step="0.1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxa-pix">Taxa PIX (%)</Label>
                      <Input id="taxa-pix" type="number" defaultValue="1.0" step="0.1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxa-boleto">Taxa Boleto (R$)</Label>
                      <Input id="taxa-boleto" type="number" defaultValue="2.50" step="0.01" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métodos de Pagamento Ativos</CardTitle>
                  <CardDescription>Gerencie os métodos de pagamento disponíveis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { nome: "Cartão de Crédito", status: true, taxa: "3.5%" },
                      { nome: "PIX", status: true, taxa: "1.0%" },
                      { nome: "Boleto Bancário", status: true, taxa: "R$ 2,50" },
                      { nome: "PayPal", status: false, taxa: "4.0%" },
                      { nome: "Transferência Bancária", status: true, taxa: "Grátis" },
                    ].map((metodo, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg space-y-2 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-3">
                          <Switch checked={metodo.status} />
                          <div>
                            <p className="text-sm font-medium">{metodo.nome}</p>
                            <p className="text-xs text-muted-foreground">Taxa: {metodo.taxa}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                      </div>
                    ))}
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
                    <div className="flex flex-wrap gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded border-2 border-blue-600 cursor-pointer"></div>
                      <div className="w-8 h-8 bg-green-600 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-purple-600 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-red-600 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-orange-600 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-pink-600 rounded border cursor-pointer"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo da Empresa</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">Logo</span>
                        </div>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Fazer Upload
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="favicon">Favicon</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">ICO</span>
                        </div>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Fazer Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Modo Escuro</Label>
                      <p className="text-sm text-muted-foreground">Permitir que usuários alternem para modo escuro</p>
                    </div>
                    <Switch checked={modoEscuro} onCheckedChange={setModoEscuro} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cor-primaria">Cor Primária (Hex)</Label>
                    <div className="flex space-x-2">
                      <Input id="cor-primaria" defaultValue="#3B82F6" className="flex-1" />
                      <div className="w-10 h-10 bg-blue-500 rounded border"></div>
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
