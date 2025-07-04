"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { CreditCard, Truck, Package, Webhook, Settings, CheckCircle, XCircle } from "lucide-react"

export default function IntegracaoPage() {
  const [integracoes, setIntegracoes] = useState({
    pagseguro: {
      ativo: true,
      email: "admin@empresa.com",
      token: "••••••••••••••••",
      sandbox: false,
    },
    correios: {
      ativo: true,
      usuario: "empresa123",
      senha: "••••••••",
      codigoServico: "04014",
    },
    maisenvio: {
      ativo: false,
      token: "",
      sandbox: true,
    },
  })

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      nome: "Pagamento Aprovado",
      url: "https://api.empresa.com/webhook/pagamento",
      ativo: true,
      eventos: ["payment.approved", "payment.cancelled"],
    },
    {
      id: 2,
      nome: "Pedido Criado",
      url: "https://api.empresa.com/webhook/pedido",
      ativo: true,
      eventos: ["order.created", "order.updated"],
    },
  ])

  const toggleIntegracao = (tipo: string) => {
    setIntegracoes((prev) => ({
      ...prev,
      [tipo]: {
        ...prev[tipo],
        ativo: !prev[tipo].ativo,
      },
    }))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole="admin" />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header userRole="admin" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Integrações</h1>
              <p className="text-muted-foreground">Configure as integrações da plataforma</p>
            </div>

            <Tabs defaultValue="pagamentos" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
                <TabsTrigger value="frete">Frete</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              </TabsList>

              {/* Pagamentos */}
              <TabsContent value="pagamentos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      PagSeguro
                    </CardTitle>
                    <CardDescription>Configure a integração com PagSeguro</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Status da Integração</h4>
                        <p className="text-sm text-muted-foreground">
                          {integracoes.pagseguro.ativo ? "Integração ativa" : "Integração inativa"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={integracoes.pagseguro.ativo ? "default" : "secondary"}>
                          {integracoes.pagseguro.ativo ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {integracoes.pagseguro.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                        <Switch
                          checked={integracoes.pagseguro.ativo}
                          onCheckedChange={() => toggleIntegracao("pagseguro")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pagseguro-email">Email</Label>
                        <Input
                          id="pagseguro-email"
                          value={integracoes.pagseguro.email}
                          onChange={(e) =>
                            setIntegracoes((prev) => ({
                              ...prev,
                              pagseguro: { ...prev.pagseguro, email: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="pagseguro-token">Token</Label>
                        <Input
                          id="pagseguro-token"
                          type="password"
                          value={integracoes.pagseguro.token}
                          onChange={(e) =>
                            setIntegracoes((prev) => ({
                              ...prev,
                              pagseguro: { ...prev.pagseguro, token: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pagseguro-sandbox"
                        checked={integracoes.pagseguro.sandbox}
                        onCheckedChange={(checked) =>
                          setIntegracoes((prev) => ({
                            ...prev,
                            pagseguro: { ...prev.pagseguro, sandbox: checked },
                          }))
                        }
                      />
                      <Label htmlFor="pagseguro-sandbox">Modo Sandbox (Testes)</Label>
                    </div>

                    <Button>Salvar Configurações</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Frete */}
              <TabsContent value="frete" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Correios */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Correios
                      </CardTitle>
                      <CardDescription>Integração com os Correios</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={integracoes.correios.ativo ? "default" : "secondary"}>
                          {integracoes.correios.ativo ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {integracoes.correios.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                        <Switch
                          checked={integracoes.correios.ativo}
                          onCheckedChange={() => toggleIntegracao("correios")}
                        />
                      </div>

                      <div>
                        <Label htmlFor="correios-usuario">Usuário</Label>
                        <Input
                          id="correios-usuario"
                          value={integracoes.correios.usuario}
                          onChange={(e) =>
                            setIntegracoes((prev) => ({
                              ...prev,
                              correios: { ...prev.correios, usuario: e.target.value },
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="correios-senha">Senha</Label>
                        <Input
                          id="correios-senha"
                          type="password"
                          value={integracoes.correios.senha}
                          onChange={(e) =>
                            setIntegracoes((prev) => ({
                              ...prev,
                              correios: { ...prev.correios, senha: e.target.value },
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="correios-servico">Código do Serviço</Label>
                        <Input
                          id="correios-servico"
                          value={integracoes.correios.codigoServico}
                          onChange={(e) =>
                            setIntegracoes((prev) => ({
                              ...prev,
                              correios: { ...prev.correios, codigoServico: e.target.value },
                            }))
                          }
                        />
                      </div>

                      <Button>Salvar</Button>
                    </CardContent>
                  </Card>

                  {/* Mais Envio */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Mais Envio
                      </CardTitle>
                      <CardDescription>Integração com Mais Envio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={integracoes.maisenvio.ativo ? "default" : "secondary"}>
                          {integracoes.maisenvio.ativo ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {integracoes.maisenvio.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                        <Switch
                          checked={integracoes.maisenvio.ativo}
                          onCheckedChange={() => toggleIntegracao("maisenvio")}
                        />
                      </div>

                      <div>
                        <Label htmlFor="maisenvio-token">Token da API</Label>
                        <Input
                          id="maisenvio-token"
                          type="password"
                          value={integracoes.maisenvio.token}
                          onChange={(e) =>
                            setIntegracoes((prev) => ({
                              ...prev,
                              maisenvio: { ...prev.maisenvio, token: e.target.value },
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="maisenvio-sandbox"
                          checked={integracoes.maisenvio.sandbox}
                          onCheckedChange={(checked) =>
                            setIntegracoes((prev) => ({
                              ...prev,
                              maisenvio: { ...prev.maisenvio, sandbox: checked },
                            }))
                          }
                        />
                        <Label htmlFor="maisenvio-sandbox">Modo Sandbox</Label>
                      </div>

                      <Button>Salvar</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Webhooks */}
              <TabsContent value="webhooks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Webhook className="h-5 w-5" />
                      Webhooks Configurados
                    </CardTitle>
                    <CardDescription>Gerencie os webhooks da aplicação</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {webhooks.map((webhook) => (
                        <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{webhook.nome}</h4>
                            <p className="text-sm text-muted-foreground">{webhook.url}</p>
                            <div className="flex gap-1 mt-1">
                              {webhook.eventos.map((evento) => (
                                <Badge key={evento} variant="outline" className="text-xs">
                                  {evento}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={webhook.ativo ? "default" : "secondary"}>
                              {webhook.ativo ? "Ativo" : "Inativo"}
                            </Badge>
                            <Switch
                              checked={webhook.ativo}
                              onCheckedChange={(checked) => {
                                setWebhooks((prev) =>
                                  prev.map((w) => (w.id === webhook.id ? { ...w, ativo: checked } : w)),
                                )
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configurações */}
              <TabsContent value="configuracoes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configurações Gerais
                    </CardTitle>
                    <CardDescription>Configurações avançadas das integrações</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="timeout">Timeout das Requisições (segundos)</Label>
                      <Input id="timeout" type="number" defaultValue="30" />
                    </div>

                    <div>
                      <Label htmlFor="retry">Tentativas de Retry</Label>
                      <Input id="retry" type="number" defaultValue="3" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="logs" defaultChecked />
                      <Label htmlFor="logs">Habilitar Logs Detalhados</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" defaultChecked />
                      <Label htmlFor="notifications">Notificações de Erro</Label>
                    </div>

                    <Button>Salvar Configurações</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
