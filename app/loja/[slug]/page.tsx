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
  Filter,
  X,
  Store,
  Phone,
  Mail,
  MapPin,
  Heart,
  Share2,
  Star,
  User,
} from "lucide-react"

const lojas = {
  "loja-julio-silva": {
    id: "1",
    nome: "Loja Brinque Brinque",
    descricao: "",
    proprietario: "Brinque Brinque",
    telefone: "(45) 99999-9999",
    email: "contato@brinquebrinque.com.br",
    endereco: "Cascavel, PR",
    avatar: "https://placehold.co/60x60/FF7043/FFFFFF?text=BB",
    cor: "#FF7043",
    logo: "https://placehold.co/80x80/FF7043/FFFFFF?text=BB",
    banner: "https://placehold.co/1200x300/FFCA28/333333?text=Bem-vindo+a+Loja+Brinque+Brinque",
  },
  "loja-maria-santos": {
    id: "2",
    nome: "Loja da Maria Santos",
    descricao: "",
    proprietario: "Maria Santos",
    telefone: "(11) 88888-8888",
    email: "maria@revendedor.com",
    endereco: "Rio de Janeiro, RJ",
    avatar: "https://placehold.co/60x60/3B82F6/FFFFFF?text=MS",
    cor: "#3B82F6",
    logo: "https://placehold.co/80x80/3B82F6/FFFFFF?text=BB",
    banner: "https://placehold.co/1200x300/60A5FA/FFFFFF?text=Conheca+os+Produtos+da+Maria",
  },
}

const produtos = [
  {
    id: "1",
    nome: "Blocos de Montar Coloridos",
    descricao: "Conjunto de blocos de montar educativos para estimular a criatividade e o desenvolvimento motor.",
    preco: 89.90,
    precoOriginal: 120.00,
    categoria: "Brinquedos",
    estoque: 15,
    imagem: "https://placehold.co/300x300/FF7043/FFFFFF?text=Blocos+Coloridos",
    avaliacao: 4.8,
    avaliacoes: 124,
    desconto: 25,
  },
  {
    id: "2",
    nome: "Quebra-Cabeça de Animais",
    descricao: "Quebra-cabeça de madeira com animais da fazenda, ideal para crianças pequenas.",
    preco: 55.50,
    precoOriginal: 65.00,
    categoria: "Jogos",
    estoque: 8,
    imagem: "https://placehold.co/300x300/3B82F6/FFFFFF?text=Quebra-Cabeca",
    avaliacao: 4.6,
    avaliacoes: 89,
    desconto: 15,
  },
  {
    id: "3",
    nome: "Boneca Interativa Sofia",
    descricao: "Boneca que fala e canta, com acessórios e roupas intercambiáveis.",
    preco: 199.90,
    precoOriginal: 250.00,
    categoria: "Bonecas",
    estoque: 5,
    imagem: "https://placehold.co/300x300/FFCA28/333333?text=Boneca+Sofia",
    avaliacao: 4.9,
    avaliacoes: 67,
    desconto: 20,
  },
  {
    id: "4",
    nome: "Carrinho de Controle Remoto",
    descricao: "Carrinho de alta velocidade com controle remoto, perfeito para corridas emocionantes.",
    preco: 149.99,
    precoOriginal: 180.00,
    categoria: "Veículos",
    estoque: 20,
    imagem: "https://placehold.co/300x300/60A5FA/FFFFFF?text=Carrinho+RC",
    avaliacao: 4.3,
    avaliacoes: 156,
    desconto: 17,
  },
  {
    id: "5",
    nome: "Kit de Pintura Infantil",
    descricao: "Kit completo com tintas, pincéis e telas para pequenos artistas.",
    preco: 75.00,
    precoOriginal: 90.00,
    categoria: "Artes e Ofícios",
    estoque: 10,
    imagem: "https://placehold.co/300x300/FF7043/FFFFFF?text=Kit+Pintura",
    avaliacao: 4.5,
    avaliacoes: 95,
    desconto: 15,
  },
  {
    id: "6",
    nome: "Ursinho de Pelúcia Gigante",
    descricao: "Ursinho de pelúcia macio e abraçável, perfeito para todas as idades.",
    preco: 299.00,
    precoOriginal: 350.00,
    categoria: "Pelúcias",
    estoque: 3,
    imagem: "https://placehold.co/300x300/3B82F6/FFFFFF?text=Ursinho+Gigante",
    avaliacao: 4.7,
    avaliacoes: 78,
    desconto: 15,
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

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@300..700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);


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

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${slug}`)
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [slug])

  const updateQuantity = (id: string, quantidade: number) => {
    let newCart = quantidade <= 0
      ? cart.filter((item) => item.id !== id)
      : cart.map((item) => (item.id === id ? { ...item, quantidade } : item))
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-quicksand">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-fredoka text-gray-800 mb-4">Loja não encontrada</h1>
          <p className="text-lg text-gray-600 mb-6">A loja que você está procurando não existe ou o endereço está incorreto.</p>
          <Button onClick={() => router.push('/')} className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-200">
            Voltar para a Página Inicial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-quicksand">
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 sm:py-4">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <img src={loja.logo} alt={loja.nome} className="h-12 w-12 rounded-2xl object-cover shadow-sm" />
            <h1 className="text-2xl sm:text-3xl font-fredoka text-orange-600">{loja.nome}</h1>
          </div>
          <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0 mx-auto sm:mx-0 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar brinquedos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:border-orange-500 focus:ring-orange-500/30 transition-all duration-200 shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 mt-3 sm:mt-0 ml-0 sm:ml-4"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-sm">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-b-3xl shadow-xl">
        <img
          src={loja.banner}
          alt="Banner da loja"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          {/* <h2 className="text-4xl sm:text-5xl lg:text-6xl font-fredoka mb-2 sm:mb-4 drop-shadow-lg leading-tight">Bem-vindo à <span style={{ color: loja.cor }}>{loja.nome}</span></h2> */}
          {/* <p className="text-lg sm:text-xl lg:text-2xl opacity-90 max-w-2xl">{loja.descricao}</p> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10">
        <aside className="space-y-6 lg:col-span-1">
          <Card className="rounded-2xl shadow-lg p-4 border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="font-quicksand text-xl flex items-center text-gray-800">
                <Store className="mr-2 text-orange-500 h-6 w-6" /> Informações da Loja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-16 w-16 rounded-2xl border-2 border-orange-300 shadow-sm">
                  <AvatarImage src={loja.avatar} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-xl">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg text-gray-800">{loja.proprietario}</p>
                  <p className="text-gray-500 text-sm">Proprietário</p>
                </div>
              </div>
              <Separator className="bg-gray-200" />
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <span className="text-base">{loja.telefone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <span className="text-base">{loja.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span className="text-base">{loja.endereco}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg p-4 border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="font-quicksand text-xl flex items-center text-gray-800">
                <Filter className="mr-2 text-orange-500 h-6 w-6" /> Categorias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categorias.map(cat => (
                <Button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-xl font-semibold transition-all duration-200
                    ${selectedCategory === cat ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  {cat === 'todos' ? 'Todos os produtos' : cat}
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl sm:text-4xl font-fredoka text-gray-900 mb-2 sm:mb-0">
              {selectedCategory === 'todos' ? 'Todos os Produtos' : selectedCategory}
            </h2>
            <p className="text-lg text-gray-600">{filteredProdutos.length} produtos encontrados</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProdutos.map(produto => (
              <Card
                key={produto.id}
                className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col overflow-hidden border border-gray-100 hover:border-orange-300"
              >
                <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
                  {/* Imagem do produto */}
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-110 rounded-t-xl"
                  />

                  {/* Badge de desconto, centralizado e animado */}
                  {produto.desconto > 0 && (
                    <span
                      className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-base font-bold px-4 py-1.5 rounded-full shadow-lg z-10 animate-bounce"
                      style={{ animationDuration: '2.4s', animationIterationCount: 'infinite' }}
                    >
                      -{produto.desconto}% OFF
                    </span>
                  )}

                  {/* Botão de wishlist, só no hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white rounded-full shadow-md hover:bg-red-100 text-gray-700 hover:text-red-500 h-10 w-10 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 flex flex-col flex-grow bg-white">
                  {/* Categoria */}
                  <div className="mb-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 font-medium px-2 py-1 rounded-full text-xs">
                      {produto.categoria}
                    </Badge>
                  </div>

                  {/* Nome do produto */}
                  <h3 className="font-quicksand text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {produto.nome}
                  </h3>
                  {/* Descrição */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3 min-h-[42px]">
                    {produto.descricao}
                  </p>

                  <div className="mt-auto">
                    {/* Estrelas e avaliações */}
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(produto.avaliacao) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">
                        {produto.avaliacao} ({produto.avaliacoes})
                      </span>
                    </div>

                    {/* Preço e estoque */}
                    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                      <div className="flex items-baseline gap-1 flex-shrink">
                        <span className="text-xl font-bold text-orange-600">
                          R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        {produto.precoOriginal > produto.preco && (
                          <span className="text-xs text-gray-400 line-through">
                            R$ {produto.precoOriginal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Botão adicionar ao carrinho + compartilhar */}
                    <div className="flex gap-2">
                      <Button
                        className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[15px] font-bold h-10 px-4 w-full max-w-[180px] shadow-md transition-all duration-150"
                        onClick={() => addToCart(produto)}
                        disabled={produto.estoque === 0}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {produto.estoque === 0 ? 'Esgotado' : 'Adicionar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-orange-500 h-10 w-10 transition-all duration-150"
                        aria-label="Compartilhar"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

            ))}
          </div>

          {filteredProdutos.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg mt-8">
              <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</p>
              <p className="text-base text-gray-600">Tente ajustar os filtros ou a busca</p>
            </div>
          )}
        </div>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-lg bg-white p-6 rounded-l-3xl shadow-2xl">
          <SheetHeader>
            <SheetTitle className="text-3xl font-fredoka text-gray-800 mb-4">Carrinho de Compras</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                <p className="text-lg text-gray-500">Seu carrinho está vazio</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
                  <img src={item.imagem} alt={item.nome} className="h-20 w-20 object-cover rounded-lg shadow-sm" />
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-800 mb-1">{item.nome}</p>
                    <p className="text-base text-gray-600">R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 text-gray-600 hover:bg-gray-100 transition-all duration-200" onClick={() => updateQuantity(item.id, item.quantidade - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-base font-medium text-gray-800 w-8 text-center">{item.quantidade}</span>
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 text-gray-600 hover:bg-gray-100 transition-all duration-200" onClick={() => updateQuantity(item.id, item.quantidade + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full h-10 w-10" onClick={() => removeFromCart(item.id)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="mt-6">
              <Separator className="my-4 bg-gray-200" />
              <div className="flex justify-between text-2xl font-bold text-gray-900 mb-4">
                <span>Total:</span>
                <span>R$ {cartTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <Button className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.01]" onClick={() => { setIsCartOpen(false); router.push(`/loja/${slug}/checkout`); }}>
                Finalizar Compra
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <footer className="bg-white border-t border-gray-200 mt-16 py-8 text-center rounded-t-3xl shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} {loja.nome} — Desenvolvido pela BitWise Agency</p>
        </div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF7043;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FF5722;
        }
      `}</style>
    </div>
  )
}