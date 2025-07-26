"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CreditCard, Truck, MapPin, User, Lock, CheckCircle, AlertCircle } from "lucide-react"

interface CartItem {
  id: string
  nome: string
  preco: number
  quantidade: number
  imagem: string
}

interface CheckoutData {
  cliente: {
    nome: string
    email: string
    telefone: string
    cpf: string
  }
  endereco: {
    cep: string
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
  pagamento: {
    metodo: "cartao" | "pix" | "boleto"
    cartao?: {
      numero: string
      nome: string
      validade: string
      cvv: string
      parcelas: number
    }
  }
  frete: {
    tipo: "normal" | "expresso"
    valor: number
    prazo: string
  }
}

// Dados mockados das lojas
const lojas = {
  "loja-joao-silva": {
    id: "1",
    nome: "Loja do João Silva",
    proprietario: "João Silva",
  },
  "loja-maria-santos": {
    id: "2",
    nome: "Loja da Maria Santos",
    proprietario: "Maria Santos",
  },
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const loja = lojas[slug as keyof typeof lojas]

  const [cart, setCart] = useState<CartItem[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    cliente: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
    },
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    pagamento: {
      metodo: "cartao",
      cartao: {
        numero: "",
        nome: "",
        validade: "",
        cvv: "",
        parcelas: 1,
      },
    },
    frete: {
      tipo: "normal",
      valor: 15.0,
      prazo: "5-7 dias úteis",
    },
  })

  // Recuperar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${slug}`)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    } else {
      // Carrinho de exemplo se não houver dados salvos
      const mockCart = [
        {
          id: "1",
          nome: "Produto Premium XYZ",
          preco: 225.0,
          quantidade: 2,
          imagem: "/placeholder.svg?height=80&width=80&text=Produto Premium XYZ",
        },
        {
          id: "2",
          nome: "Produto Especial ABC",
          preco: 180.0,
          quantidade: 1,
          imagem: "/placeholder.svg?height=80&width=80&text=Produto Especial ABC",
        },
      ]
      setCart(mockCart)
      localStorage.setItem(`cart-${slug}`, JSON.stringify(mockCart))
    }
  }, [slug])

  const subtotal = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  const frete = checkoutData.frete.valor
  const desconto = checkoutData.pagamento.metodo === "pix" ? subtotal * 0.05 : 0
  const total = subtotal + frete - desconto

  const handleInputChange = (section: keyof CheckoutData, field: string, value: string | number) => {
    setCheckoutData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleCartaoChange = (field: string, value: string | number) => {
    setCheckoutData((prev) => ({
      ...prev,
      pagamento: {
        ...prev.pagamento,
        cartao: {
          ...prev.pagamento.cartao!,
          [field]: value,
        },
      },
    }))
  }

  const buscarCEP = async (cep: string) => {
    if (cep.replace(/\D/g, "").length === 8) {
      // Simular busca de CEP
      setTimeout(() => {
        setCheckoutData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: "Rua das Flores",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
          },
        }))
      }, 1000)
    }
  }

  const calcularFrete = (tipo: "normal" | "expresso") => {
    const valores = {
      normal: { valor: 15.0, prazo: "5-7 dias úteis" },
      expresso: { valor: 25.0, prazo: "2-3 dias úteis" },
    }

    setCheckoutData((prev) => ({
      ...prev,
      frete: {
        tipo,
        ...valores[tipo],
      },
    }))
  }

  const processarPedido = async () => {
    setIsProcessing(true)

    // Simular processamento do pedido
    setTimeout(() => {
      const newOrderId = `PED-${Date.now()}`
      setOrderId(newOrderId)
      setOrderComplete(true)
      setIsProcessing(false)

      // Limpar carrinho após pedido processado
      localStorage.removeItem(`cart-${slug}`)
    }, 3000)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          checkoutData.cliente.nome.trim() !== "" &&
          checkoutData.cliente.email.trim() !== "" &&
          checkoutData.cliente.telefone.trim() !== "" &&
          checkoutData.cliente.cpf.trim() !== ""
        )
      case 2:
        return (
          checkoutData.endereco.cep.trim() !== "" &&
          checkoutData.endereco.rua.trim() !== "" &&
          checkoutData.endereco.numero.trim() !== "" &&
          checkoutData.endereco.cidade.trim() !== "" &&
          checkoutData.endereco.estado.trim() !== ""
        )
      case 3:
        if (checkoutData.pagamento.metodo === "cartao") {
          return (
            checkoutData.pagamento.cartao?.numero.trim() !== "" &&
            checkoutData.pagamento.cartao?.nome.trim() !== "" &&
            checkoutData.pagamento.cartao?.validade.trim() !== "" &&
            checkoutData.pagamento.cartao?.cvv.trim() !== ""
          )
        }
        return true
      default:
        return false
    }
  }

  // Redirecionar se carrinho estiver vazio
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Carrinho Vazio</h2>
            <p className="text-muted-foreground mb-4">Adicione produtos ao carrinho antes de finalizar a compra.</p>
            <Button className="w-full" onClick={() => router.push(`/loja/${slug}`)}>
              Voltar à Loja
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Pedido Confirmado!</h2>
            <p className="text-muted-foreground mb-4">Seu pedido foi processado com sucesso.</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">Número do pedido:</p>
              <p className="font-mono font-bold">{orderId}</p>
            </div>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => router.push(`/loja/${slug}`)}>
                Continuar Comprando
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => window.print()}>
                Imprimir Comprovante
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!loja) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loja não encontrada</h1>
          <p className="text-muted-foreground">A loja que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push(`/loja/${slug}`)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Loja
          </Button>
          <h1 className="text-3xl font-bold">Finalizar Compra - {loja.nome}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Checkout */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Indicador de Passos */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`w-16 h-1 mx-2 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Passo 1: Dados Pessoais */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Dados Pessoais
                    </CardTitle>
                    <CardDescription>Informe seus dados para identificação do pedido</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          value={checkoutData.cliente.nome}
                          onChange={(e) => handleInputChange("cliente", "nome", e.target.value)}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          value={checkoutData.cliente.cpf}
                          onChange={(e) => handleInputChange("cliente", "cpf", e.target.value)}
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={checkoutData.cliente.email}
                          onChange={(e) => handleInputChange("cliente", "email", e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input
                          id="telefone"
                          value={checkoutData.cliente.telefone}
                          onChange={(e) => handleInputChange("cliente", "telefone", e.target.value)}
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => setCurrentStep(2)} disabled={!validateStep(1)}>
                      Continuar para Endereço
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Passo 2: Endereço */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Endereço de Entrega
                    </CardTitle>
                    <CardDescription>Informe o endereço onde deseja receber o pedido</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <Input
                          id="cep"
                          value={checkoutData.endereco.cep}
                          onChange={(e) => {
                            handleInputChange("endereco", "cep", e.target.value)
                            buscarCEP(e.target.value)
                          }}
                          placeholder="00000-000"
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rua">Rua *</Label>
                        <Input
                          id="rua"
                          value={checkoutData.endereco.rua}
                          onChange={(e) => handleInputChange("endereco", "rua", e.target.value)}
                          placeholder="Nome da rua"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número *</Label>
                        <Input
                          id="numero"
                          value={checkoutData.endereco.numero}
                          onChange={(e) => handleInputChange("endereco", "numero", e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                          id="complemento"
                          value={checkoutData.endereco.complemento}
                          onChange={(e) => handleInputChange("endereco", "complemento", e.target.value)}
                          placeholder="Apto, bloco, etc. (opcional)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro *</Label>
                        <Input
                          id="bairro"
                          value={checkoutData.endereco.bairro}
                          onChange={(e) => handleInputChange("endereco", "bairro", e.target.value)}
                          placeholder="Bairro"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade *</Label>
                        <Input
                          id="cidade"
                          value={checkoutData.endereco.cidade}
                          onChange={(e) => handleInputChange("endereco", "cidade", e.target.value)}
                          placeholder="Cidade"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Select
                          value={checkoutData.endereco.estado}
                          onValueChange={(value) => handleInputChange("endereco", "estado", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                        Voltar
                      </Button>
                      <Button onClick={() => setCurrentStep(3)} disabled={!validateStep(2)} className="flex-1">
                        Continuar para Frete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Passo 3: Frete */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Opções de Frete
                    </CardTitle>
                    <CardDescription>Escolha como deseja receber seu pedido</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={checkoutData.frete.tipo}
                      onValueChange={(value: "normal" | "expresso") => calcularFrete(value)}
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="normal" id="normal" />
                        <div className="flex-1">
                          <Label htmlFor="normal" className="font-medium cursor-pointer">
                            Frete Normal
                          </Label>
                          <p className="text-sm text-muted-foreground">5-7 dias úteis</p>
                        </div>
                        <span className="font-medium">R$ 15,00</span>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="expresso" id="expresso" />
                        <div className="flex-1">
                          <Label htmlFor="expresso" className="font-medium cursor-pointer">
                            Frete Expresso
                          </Label>
                          <p className="text-sm text-muted-foreground">2-3 dias úteis</p>
                        </div>
                        <span className="font-medium">R$ 25,00</span>
                      </div>
                    </RadioGroup>
                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                        Voltar
                      </Button>
                      <Button onClick={() => setCurrentStep(4)} className="flex-1">
                        Continuar para Pagamento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Passo 4: Pagamento */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Forma de Pagamento
                    </CardTitle>
                    <CardDescription>Escolha como deseja pagar seu pedido</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={checkoutData.pagamento.metodo}
                      onValueChange={(value: "cartao" | "pix" | "boleto") =>
                        handleInputChange("pagamento", "metodo", value)
                      }
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="cartao" id="cartao" />
                        <Label htmlFor="cartao" className="cursor-pointer">
                          Cartão de Crédito
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="cursor-pointer">
                          PIX (5% de desconto)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="boleto" id="boleto" />
                        <Label htmlFor="boleto" className="cursor-pointer">
                          Boleto Bancário
                        </Label>
                      </div>
                    </RadioGroup>

                    {checkoutData.pagamento.metodo === "cartao" && (
                      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <div className="space-y-2">
                          <Label htmlFor="numero-cartao">Número do Cartão *</Label>
                          <Input
                            id="numero-cartao"
                            value={checkoutData.pagamento.cartao?.numero || ""}
                            onChange={(e) => handleCartaoChange("numero", e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nome-cartao">Nome no Cartão *</Label>
                          <Input
                            id="nome-cartao"
                            value={checkoutData.pagamento.cartao?.nome || ""}
                            onChange={(e) => handleCartaoChange("nome", e.target.value)}
                            placeholder="Nome como está no cartão"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="validade">Validade *</Label>
                            <Input
                              id="validade"
                              value={checkoutData.pagamento.cartao?.validade || ""}
                              onChange={(e) => handleCartaoChange("validade", e.target.value)}
                              placeholder="MM/AA"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={checkoutData.pagamento.cartao?.cvv || ""}
                              onChange={(e) => handleCartaoChange("cvv", e.target.value)}
                              placeholder="123"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="parcelas">Parcelas</Label>
                            <Select
                              value={checkoutData.pagamento.cartao?.parcelas.toString() || "1"}
                              onValueChange={(value) => handleCartaoChange("parcelas", Number.parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1x sem juros</SelectItem>
                                <SelectItem value="2">2x sem juros</SelectItem>
                                <SelectItem value="3">3x sem juros</SelectItem>
                                <SelectItem value="6">6x com juros</SelectItem>
                                <SelectItem value="12">12x com juros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {checkoutData.pagamento.metodo === "pix" && (
                      <div className="p-4 border rounded-lg bg-green-50">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">PIX Selecionado</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Você receberá o código PIX após confirmar o pedido. Pagamento à vista com 5% de desconto.
                        </p>
                      </div>
                    )}

                    {checkoutData.pagamento.metodo === "boleto" && (
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-800">Boleto Bancário</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          O boleto será gerado após a confirmação do pedido. Prazo de vencimento: 3 dias úteis.
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
                        Voltar
                      </Button>
                      <Button onClick={processarPedido} disabled={!validateStep(3) || isProcessing} className="flex-1">
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processando...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Finalizar Pedido
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.imagem || "/placeholder.svg"}
                        alt={item.nome}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.nome}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantidade}</p>
                      </div>
                      <span className="text-sm font-medium">
                        R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete ({checkoutData.frete.tipo}):</span>
                    <span>R$ {frete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {desconto > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto PIX (5%):</span>
                      <span>-R$ {desconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>

                {checkoutData.pagamento.metodo === "cartao" && checkoutData.pagamento.cartao?.parcelas > 1 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {checkoutData.pagamento.cartao.parcelas}x de R${" "}
                    {(total / checkoutData.pagamento.cartao.parcelas).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                )}

                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Compra 100% segura e protegida</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
