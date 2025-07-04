"use client"
import { PedidosPage } from "@/components/pedidos/pedidos-page"

const mockPedidos = [
  {
    id: "PED-002",
    numero: "2024002",
    cliente: "Maria Santos",
    email: "maria@email.com",
    telefone: "(11) 88888-8888",
    data: "2024-01-15T10:15:00Z",
    status: "processando",
    total: 280.0,
    frete: 15.0,
    desconto: 0,
    pagamento: "Cartão de Crédito",
    endereco: {
      rua: "Av. Paulista, 456",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      cep: "01310-100",
      estado: "SP",
    },
    itens: [{ produto: "Produto Especial ABC", quantidade: 1, preco: 280.0, total: 280.0 }],
  },
  {
    id: "PED-004",
    numero: "2024004",
    cliente: "Ana Costa",
    email: "ana@email.com",
    telefone: "(11) 66666-6666",
    data: "2024-01-14T09:20:00Z",
    status: "entregue",
    total: 560.0,
    frete: 20.0,
    desconto: 0,
    pagamento: "Cartão de Crédito",
    endereco: {
      rua: "Rua Oscar Freire, 321",
      bairro: "Jardins",
      cidade: "São Paulo",
      cep: "01426-001",
      estado: "SP",
    },
    itens: [{ produto: "Produto Especial ABC", quantidade: 2, preco: 280.0, total: 560.0 }],
  },
]

const mockProdutos = [
  { id: 1, nome: "Produto Premium XYZ", preco: 225.0 },
  { id: 2, nome: "Produto Especial ABC", preco: 280.0 },
  { id: 3, nome: "Produto Standard DEF", preco: 150.0 },
]

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800",
  processando: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  entregue: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
}

const statusLabels = {
  pendente: "Pendente",
  processando: "Processando",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
}

export default function RevendedorPedidosPage() {
  return <PedidosPage userRole="revendedor" title="Meus Pedidos" description="Gerencie os pedidos da sua loja" />
}

