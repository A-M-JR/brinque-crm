"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Phone,
  Mail,
  MapPin,
  Heart,
  Share2,
  Filter,
  X,
  Store,
  User,
} from "lucide-react"

// Dados mockados das lojas
const lojas = {
  "loja-joao-silva": {
    id: "1",
    nome: "Loja do João Silva",
    descricao: "Sua loja online com os melhores produtos",
    proprietario: "João Silva",
    telefone: "(11) 99999-9999",
    email: "joao@distribuidor.com",
    endereco: "São Paulo, SP",
    avatar: "/placeholder.svg?height=60&width=60",
    cor: "#3b82f6",
    logo: "/placeholder.svg?height=80&width=80",
    banner: "/placeholder.svg?height=300&width=1200&text=Banner da Loja",
  },
  "loja-maria-santos": {
    id: "2",
    nome: "Loja da Maria Santos",
    descricao: "Os melhores produtos com atendimento personalizado",
    proprietario: "Maria Santos",
    telefone: "(11) 88888-8888",
    email: "maria@revendedor.com",
    endereco: "Rio de Janeiro, RJ",
    avatar: "/placeholder.svg?height=60&width=60",
    cor: "#10b981",
    logo: "/placeholder.svg?height=80&width=80",
    banner: "/placeholder.svg?height=300&width=1200&text=Banner da Loja",
  },
}

const produtos = [
  {
    id: "1",
    nome: "Produto Premium XYZ",
    descricao: "Produto de alta qualidade com excelente custo-benefício. Ideal para uso profissional.",
    preco: 225.0,
    precoOriginal: 280.0,
    categoria: "Eletrônicos",
    estoque: 15,
    imagem: "/placeholder.svg?height=300&width=300&text=Produto Premium XYZ",
    avaliacao: 4.8,
    avaliacoes: 124,
    desconto: 20,
  },
  {
    id: "2",
    nome: "Produto Especial ABC",
    descricao: "Produto especial para clientes exigentes. Qualidade garantida.",
    preco: 180.0,
    precoOriginal: 200.0,
    categoria: "Casa e Jardim",
    estoque: 8,
    imagem: "/placeholder.svg?height=300&width=300&text=Produto Especial ABC",
    avaliacao: 4.6,
    avaliacoes: 89,
    desconto: 10,
  },
  {
    id: "3",
    nome: "Produto Deluxe GHI",
    descricao: "Produto deluxe com acabamento premium. Para quem busca o melhor.",
    preco: 450.0,
    precoOriginal: 500.0,
    categoria: "Eletrônicos",
    estoque: 5,
    imagem: "/placeholder.svg?height=300&width=300&text=Produto Deluxe GHI",
    avaliacao: 4.9,
    avaliacoes: 67,
    desconto: 10,
  },
  {
    id: "4",
    nome: "Produto Básico DEF",
    descricao: "Produto básico com ótima qualidade. Perfeito para o dia a dia.",
    preco: 89.9,
    precoOriginal: 99.9,
    categoria: "Roupas",
    estoque: 20,
    imagem: "/placeholder.svg?height=300&width=300&text=Produto Básico DEF",
    avaliacao: 4.3,
    avaliacoes: 156,
    desconto: 10,
  },
]

interface CartItem {
  id: string
  nome: string
  preco: number
  quantidade: number
  imagem: string
}

export default function LojaPage() {
  const params = useParams()
  const slug = params.slug as string
  const loja = lojas[slug as keyof typeof lojas]
  const router = useRouter()

  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [isCartOpen, setIsCartOpen] = useState(false)

  const categorias = ["todos", ...Array.from(new Set(produtos.map((p) => p.categoria)))]

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || produto.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (produto: any) => {
    const newCart = [...cart]
    const existingItem = newCart.find((item) => item.id === produto.id)

    if (existingItem) {
      existingItem.quantidade += 1
    } else {
      newCart.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1,
        imagem: produto.imagem,
      })
    }

    setCart(newCart)
    localStorage.setItem(`cart-${slug}`, JSON.stringify(newCart))
  }

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${slug}`)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [slug])

  const updateQuantity = (id: string, quantidade: number) => {
    let newCart
    if (quantidade <= 0) {
      newCart = cart.filter((item) => item.id !== id)
    } else {
      newCart = cart.map((item) => (item.id === id ? { ...item, quantidade } : item))
    }
    setCart(newCart)
    localStorage.setItem(`cart-${slug}`, JSON.stringify(newCart))
  }

  const removeFromCart = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id)
    setCart(newCart)
    localStorage.setItem(`cart-${slug}`, JSON.stringify(newCart))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantidade, 0)

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
      {/* Header da Loja */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src={loja.logo || "/placeholder.svg"} alt={loja.nome} className="h-10 w-10 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold" style={{ color: loja.cor }}>
                  {loja.nome}
                </h1>
                <p className="text-sm text-muted-foreground">{loja.descricao}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative bg-transparent">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Carrinho de Compras</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Seu carrinho está vazio</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                              <img
                                src={item.imagem || "/placeholder.svg"}
                                alt={item.nome}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.nome}</h4>
                                <p className="text-sm text-muted-foreground">
                                  R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium w-8 text-center">{item.quantidade}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Separator />
                        <div className="space-y-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>R$ {cartTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                          </div>
                          <Button
                            className="w-full"
                            size="lg"
                            onClick={() => {
                              setIsCartOpen(false)
                              router.push(`/loja/${slug}/checkout`)
                            }}
                          >
                            Finalizar Compra
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Banner da Loja */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <img src={loja.banner || "/placeholder.svg"} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h2 className="text-4xl font-bold mb-2">Bem-vindo à {loja.nome}</h2>
            <p className="text-xl">{loja.descricao}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Informações da Loja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={loja.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{loja.proprietario}</p>
                    <p className="text-sm text-muted-foreground">Proprietário</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{loja.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{loja.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{loja.endereco}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Categorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categorias.map((categoria) => (
                    <Button
                      key={categoria}
                      variant={selectedCategory === categoria ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(categoria)}
                    >
                      {categoria === "todos" ? "Todos os Produtos" : categoria}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Produtos */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                {selectedCategory === "todos" ? "Todos os Produtos" : selectedCategory}
              </h3>
              <p className="text-muted-foreground">{filteredProdutos.length} produtos encontrados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProdutos.map((produto) => (
                <Card key={produto.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={produto.imagem || "/placeholder.svg"}
                      alt={produto.nome}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {produto.desconto > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-600">-{produto.desconto}%</Badge>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{produto.nome}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{produto.descricao}</p>

                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(produto.avaliacao) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        {produto.avaliacao} ({produto.avaliacoes})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold">
                          R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        {produto.precoOriginal > produto.preco && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            R$ {produto.precoOriginal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                      <Badge variant={produto.estoque > 10 ? "default" : "secondary"}>
                        {produto.estoque} em estoque
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" onClick={() => addToCart(produto)} disabled={produto.estoque === 0}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {produto.estoque === 0 ? "Esgotado" : "Adicionar"}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProdutos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum produto encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros ou termo de busca</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{loja.nome}</h3>
            <p className="text-muted-foreground mb-4">{loja.descricao}</p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 {loja.nome}</span>
              <span>•</span>
              <span>Powered by CRM SaaS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
