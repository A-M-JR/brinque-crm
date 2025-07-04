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
  "loja-julio-silva": {
    id: "1",
    nome: "Loja Brinque Brinque", // Nome da loja atualizado
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

  // Adicionando fontes personalizadas via Google Fonts
  useEffect(() => {
    const linkFredoka = document.createElement('link');
    linkFredoka.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap';
    linkFredoka.rel = 'stylesheet';
    document.head.appendChild(linkFredoka);

    const linkQuicksand = document.createElement('link');
    linkQuicksand.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap';
    linkQuicksand.rel = 'stylesheet';
    document.head.appendChild(linkQuicksand);

    // Limpar os links ao desmontar o componente
    return () => {
      document.head.removeChild(linkFredoka);
      document.head.removeChild(linkQuicksand);
    };
  }, []);

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
          nome: "Blocos de Montar Coloridos",
          preco: 89.90,
          quantidade: 2,
          imagem: "https://placehold.co/80x80/FF7043/FFFFFF?text=Blocos",
        },
        {
          id: "2",
          nome: "Quebra-Cabeça de Animais",
          preco: 55.50,
          quantidade: 1,
          imagem: "https://placehold.co/80x80/3B82F6/FFFFFF?text=Quebra",
        },
        {
          id: "3",
          nome: "Boneca Interativa Sofia",
          preco: 199.90,
          quantidade: 1,
          imagem: "https://placehold.co/80x80/FFCA28/333333?text=Boneca",
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
          checkoutData.endereco.bairro.trim() !== "" && // Adicionado validação para bairro
          checkoutData.endereco.cidade.trim() !== "" &&
          checkoutData.endereco.estado.trim() !== ""
        )
      case 3:
        // Frete sempre tem um valor padrão, então sempre é válido
        return true
      case 4:
        if (checkoutData.pagamento.metodo === "cartao") {
          return (
            checkoutData.pagamento.cartao?.numero.trim() !== "" &&
            checkoutData.pagamento.cartao?.nome.trim() !== "" &&
            checkoutData.pagamento.cartao?.validade.trim() !== "" &&
            checkoutData.pagamento.cartao?.cvv.trim() !== ""
          )
        }
        return true // PIX e Boleto não exigem validação de campos adicionais
      default:
        return false
    }
  }

  // Redirecionar se carrinho estiver vazio
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-quicksand">
        <Card className="w-full max-w-md rounded-2xl shadow-lg">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-fredoka text-gray-800 mb-2">Carrinho Vazio</h2>
            <p className="text-lg text-gray-600 mb-6">Adicione produtos ao carrinho antes de finalizar a compra.</p>
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => router.push(`/loja/${slug}`)}
            >
              Voltar à Loja
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-quicksand">
        <Card className="w-full max-w-md rounded-2xl shadow-lg">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-fredoka text-gray-800 mb-2">Pedido Confirmado!</h2>
            <p className="text-lg text-gray-600 mb-4">Seu pedido foi processado com sucesso.</p>
            <div className="bg-gray-100 p-4 rounded-xl mb-6 shadow-inner">
              <p className="text-sm text-gray-600 mb-1">Número do pedido:</p>
              <p className="font-mono text-xl font-bold text-orange-600">{orderId}</p>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => router.push(`/loja/${slug}`)}
              >
                Continuar Comprando
              </Button>
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-100 text-orange-600 border-orange-300 rounded-xl py-3 text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => window.print()}
              >
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-quicksand">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-fredoka text-gray-800 mb-4">Loja não encontrada</h1>
          <p className="text-lg text-gray-600 mb-6">A loja que você está procurando não existe.</p>
          <Button onClick={() => router.push('/')} className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-200">
            Voltar para a Página Inicial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-quicksand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push(`/loja/${slug}`)}
            className="text-orange-600 hover:bg-orange-50 rounded-full p-2 mr-2 transition-all duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl sm:text-4xl font-fredoka text-gray-900">Finalizar Compra - {loja.nome}</h1>
        </div>


        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 rounded-2xl shadow-lg p-6 border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-quicksand text-gray-800">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.imagem || "https://placehold.co/80x80/E0E0E0/888888?text=Item"}
                      alt={item.nome}
                      className="h-16 w-16 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-800">{item.nome}</p>
                      <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                    </div>
                    <span className="text-base font-bold text-orange-600">
                      R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-gray-200" />

              <div className="space-y-3">
                <div className="flex justify-between text-base text-gray-700">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-base text-gray-700">
                  <span>Frete ({checkoutData.frete.tipo}):</span>
                  <span>R$ {frete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between text-base text-green-600 font-semibold">
                    <span>Desconto PIX (5%):</span>
                    <span>-R$ {desconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

              <Separator className="bg-gray-200" />

              <div className="flex justify-between text-2xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-orange-600">R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>

              {checkoutData.pagamento.metodo === "cartao" && checkoutData.pagamento.cartao?.parcelas > 1 && (
                <p className="text-sm text-gray-600 text-center">
                  {checkoutData.pagamento.cartao.parcelas}x de R${" "}
                  {(total / checkoutData.pagamento.cartao.parcelas).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              )}

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 p-3 bg-gray-100 rounded-lg shadow-inner">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Compra 100% segura e protegida</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <br /><br />




        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Formulário de Checkout */}
          <div className="lg:col-span-2 space-y-8">
            {/* Indicador de Passos */}
            <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300
                      ${currentStep === step ? "bg-orange-500 text-white shadow-md" :
                        currentStep > step ? "bg-green-500 text-white" :
                          "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`flex-1 h-1 mx-2 transition-all duration-300
                      ${currentStep > step ? "bg-green-500" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>


            {/* Passo 1: Dados Pessoais */}
            {currentStep === 1 && (
              <Card className="rounded-2xl shadow-lg p-6 border border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl font-quicksand text-gray-800">
                    <User className="h-6 w-6 mr-3 text-orange-500" />
                    Dados Pessoais
                  </CardTitle>
                  <CardDescription className="text-gray-600">Informe seus dados para identificação do pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="font-semibold text-gray-800">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={checkoutData.cliente.nome}
                        onChange={(e) => handleInputChange("cliente", "nome", e.target.value)}
                        placeholder="Seu nome completo"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="font-semibold text-gray-800">CPF *</Label>
                      <Input
                        id="cpf"
                        value={checkoutData.cliente.cpf}
                        onChange={(e) => handleInputChange("cliente", "cpf", e.target.value)}
                        placeholder="000.000.000-00"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold text-gray-800">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={checkoutData.cliente.email}
                        onChange={(e) => handleInputChange("cliente", "email", e.target.value)}
                        placeholder="seu@email.com"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="font-semibold text-gray-800">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={checkoutData.cliente.telefone}
                        onChange={(e) => handleInputChange("cliente", "telefone", e.target.value)}
                        placeholder="(DD) 9XXXX-XXXX"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.005]"
                    onClick={() => setCurrentStep(2)}
                    disabled={!validateStep(1)}
                  >
                    Continuar para Endereço
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Passo 2: Endereço */}
            {currentStep === 2 && (
              <Card className="rounded-2xl shadow-lg p-6 border border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl font-quicksand text-gray-800">
                    <MapPin className="h-6 w-6 mr-3 text-orange-500" />
                    Endereço de Entrega
                  </CardTitle>
                  <CardDescription className="text-gray-600">Informe o endereço onde deseja receber o pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep" className="font-semibold text-gray-800">CEP *</Label>
                      <Input
                        id="cep"
                        value={checkoutData.endereco.cep}
                        onChange={(e) => {
                          handleInputChange("endereco", "cep", e.target.value)
                          buscarCEP(e.target.value)
                        }}
                        placeholder="00000-000"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="rua" className="font-semibold text-gray-800">Rua *</Label>
                      <Input
                        id="rua"
                        value={checkoutData.endereco.rua}
                        onChange={(e) => handleInputChange("endereco", "rua", e.target.value)}
                        placeholder="Nome da rua"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero" className="font-semibold text-gray-800">Número *</Label>
                      <Input
                        id="numero"
                        value={checkoutData.endereco.numero}
                        onChange={(e) => handleInputChange("endereco", "numero", e.target.value)}
                        placeholder="123"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="complemento" className="font-semibold text-gray-800">Complemento</Label>
                      <Input
                        id="complemento"
                        value={checkoutData.endereco.complemento}
                        onChange={(e) => handleInputChange("endereco", "complemento", e.target.value)}
                        placeholder="Apto, bloco, etc. (opcional)"
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairro" className="font-semibold text-gray-800">Bairro *</Label>
                      <Input
                        id="bairro"
                        value={checkoutData.endereco.bairro}
                        onChange={(e) => handleInputChange("endereco", "bairro", e.target.value)}
                        placeholder="Bairro"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="font-semibold text-gray-800">Cidade *</Label>
                      <Input
                        id="cidade"
                        value={checkoutData.endereco.cidade}
                        onChange={(e) => handleInputChange("endereco", "cidade", e.target.value)}
                        placeholder="Cidade"
                        required
                        className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado" className="font-semibold text-gray-800">Estado *</Label>
                      <Select
                        value={checkoutData.endereco.estado}
                        onValueChange={(value) => handleInputChange("endereco", "estado", value)}
                      >
                        <SelectTrigger className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                          <SelectItem value="CE">Ceará</SelectItem>
                          <SelectItem value="DF">Distrito Federal</SelectItem>
                          <SelectItem value="ES">Espírito Santo</SelectItem>
                          <SelectItem value="GO">Goiás</SelectItem>
                          <SelectItem value="MA">Maranhão</SelectItem>
                          <SelectItem value="MT">Mato Grosso</SelectItem>
                          <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                          <SelectItem value="PA">Pará</SelectItem>
                          <SelectItem value="PB">Paraíba</SelectItem>
                          <SelectItem value="PE">Pernambuco</SelectItem>
                          <SelectItem value="PI">Piauí</SelectItem>
                          <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                          <SelectItem value="RO">Rondônia</SelectItem>
                          <SelectItem value="RR">Roraima</SelectItem>
                          <SelectItem value="SE">Sergipe</SelectItem>
                          <SelectItem value="TO">Tocantins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 rounded-xl py-3 text-lg font-semibold text-orange-600 border-orange-300 hover:bg-orange-50 transition-all duration-200">
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!validateStep(2)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.005]"
                    >
                      Continuar para Frete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Passo 3: Frete */}
            {currentStep === 3 && (
              <Card className="rounded-2xl shadow-lg p-6 border border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl font-quicksand text-gray-800">
                    <Truck className="h-6 w-6 mr-3 text-orange-500" />
                    Opções de Frete
                  </CardTitle>
                  <CardDescription className="text-gray-600">Escolha como deseja receber seu pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={checkoutData.frete.tipo}
                    onValueChange={(value: "normal" | "expresso") => calcularFrete(value)}
                  >
                    <div className={`flex items-center space-x-4 p-4 border rounded-xl cursor-pointer transition-all duration-200
                      ${checkoutData.frete.tipo === "normal" ? "border-orange-500 bg-orange-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
                      <RadioGroupItem value="normal" id="normal" className="h-5 w-5 text-orange-500 border-orange-500" />
                      <div className="flex-1">
                        <Label htmlFor="normal" className="font-semibold text-lg text-gray-800 cursor-pointer">
                          Frete Normal
                        </Label>
                        <p className="text-sm text-gray-600">{checkoutData.frete.prazo}</p>
                      </div>
                      <span className="font-bold text-lg text-orange-600">R$ 15,00</span>
                    </div>
                    <div className={`flex items-center space-x-4 p-4 border rounded-xl cursor-pointer transition-all duration-200
                      ${checkoutData.frete.tipo === "expresso" ? "border-orange-500 bg-orange-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
                      <RadioGroupItem value="expresso" id="expresso" className="h-5 w-5 text-orange-500 border-orange-500" />
                      <div className="flex-1">
                        <Label htmlFor="expresso" className="font-semibold text-lg text-gray-800 cursor-pointer">
                          Frete Expresso
                        </Label>
                        <p className="text-sm text-gray-600">{checkoutData.frete.prazo}</p>
                      </div>
                      <span className="font-bold text-lg text-orange-600">R$ 25,00</span>
                    </div>
                  </RadioGroup>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1 rounded-xl py-3 text-lg font-semibold text-orange-600 border-orange-300 hover:bg-orange-50 transition-all duration-200">
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.005]"
                    >
                      Continuar para Pagamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Passo 4: Pagamento */}
            {currentStep === 4 && (
              <Card className="rounded-2xl shadow-lg p-6 border border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl font-quicksand text-gray-800">
                    <CreditCard className="h-6 w-6 mr-3 text-orange-500" />
                    Forma de Pagamento
                  </CardTitle>
                  <CardDescription className="text-gray-600">Escolha como deseja pagar seu pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={checkoutData.pagamento.metodo}
                    onValueChange={(value: "cartao" | "pix" | "boleto") =>
                      handleInputChange("pagamento", "metodo", value)
                    }
                  >
                    <div className={`flex items-center space-x-4 p-4 border rounded-xl cursor-pointer transition-all duration-200
                      ${checkoutData.pagamento.metodo === "cartao" ? "border-orange-500 bg-orange-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
                      <RadioGroupItem value="cartao" id="cartao" className="h-5 w-5 text-orange-500 border-orange-500" />
                      <Label htmlFor="cartao" className="font-semibold text-lg text-gray-800 cursor-pointer">
                        Cartão de Crédito
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-4 p-4 border rounded-xl cursor-pointer transition-all duration-200
                      ${checkoutData.pagamento.metodo === "pix" ? "border-orange-500 bg-orange-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
                      <RadioGroupItem value="pix" id="pix" className="h-5 w-5 text-orange-500 border-orange-500" />
                      <Label htmlFor="pix" className="font-semibold text-lg text-gray-800 cursor-pointer">
                        PIX (5% de desconto)
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-4 p-4 border rounded-xl cursor-pointer transition-all duration-200
                      ${checkoutData.pagamento.metodo === "boleto" ? "border-orange-500 bg-orange-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
                      <RadioGroupItem value="boleto" id="boleto" className="h-5 w-5 text-orange-500 border-orange-500" />
                      <Label htmlFor="boleto" className="font-semibold text-lg text-gray-800 cursor-pointer">
                        Boleto Bancário
                      </Label>
                    </div>
                  </RadioGroup>

                  {checkoutData.pagamento.metodo === "cartao" && (
                    <div className="space-y-4 p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-inner">
                      <div className="space-y-2">
                        <Label htmlFor="numero-cartao" className="font-semibold text-gray-800">Número do Cartão *</Label>
                        <Input
                          id="numero-cartao"
                          value={checkoutData.pagamento.cartao?.numero || ""}
                          onChange={(e) => handleCartaoChange("numero", e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          required
                          className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nome-cartao" className="font-semibold text-gray-800">Nome no Cartão *</Label>
                        <Input
                          id="nome-cartao"
                          value={checkoutData.pagamento.cartao?.nome || ""}
                          onChange={(e) => handleCartaoChange("nome", e.target.value)}
                          placeholder="Nome como está no cartão"
                          required
                          className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="validade" className="font-semibold text-gray-800">Validade *</Label>
                          <Input
                            id="validade"
                            value={checkoutData.pagamento.cartao?.validade || ""}
                            onChange={(e) => handleCartaoChange("validade", e.target.value)}
                            placeholder="MM/AA"
                            required
                            className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="font-semibold text-gray-800">CVV *</Label>
                          <Input
                            id="cvv"
                            value={checkoutData.pagamento.cartao?.cvv || ""}
                            onChange={(e) => handleCartaoChange("cvv", e.target.value)}
                            placeholder="123"
                            required
                            className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parcelas" className="font-semibold text-gray-800">Parcelas</Label>
                          <Select
                            value={checkoutData.pagamento.cartao?.parcelas.toString() || "1"}
                            onValueChange={(value) => handleCartaoChange("parcelas", Number.parseInt(value))}
                          >
                            <SelectTrigger className="rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200">
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
                    <div className="p-5 border border-green-300 rounded-xl bg-green-50 shadow-sm">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <span className="font-semibold text-lg text-green-800">PIX Selecionado</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Você receberá o código PIX após confirmar o pedido. Pagamento à vista com 5% de desconto.
                      </p>
                    </div>
                  )}

                  {checkoutData.pagamento.metodo === "boleto" && (
                    <div className="p-5 border border-blue-300 rounded-xl bg-blue-50 shadow-sm">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold text-lg text-blue-800">Boleto Bancário</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        O boleto será gerado após a confirmação do pedido. Prazo de vencimento: 3 dias úteis.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1 rounded-xl py-3 text-lg font-semibold text-orange-600 border-orange-300 hover:bg-orange-50 transition-all duration-200">
                      Voltar
                    </Button>
                    <Button
                      onClick={processarPedido}
                      disabled={!validateStep(4) || isProcessing}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.005]"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-3" />
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
      </div>

      {/* Estilo para a scrollbar customizada (adicionar ao seu CSS global ou em um <style> tag se for um projeto simples) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF7043; /* Cor primária da Brinque Brinque */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FF5722; /* Cor primária mais escura no hover */
        }
      `}</style>
    </div>
  )
}
