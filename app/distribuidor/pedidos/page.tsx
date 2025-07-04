"use client"
import { PedidosPage } from "@/components/pedidos/pedidos-page"

const mockPedidos = [
  {
    id: "PED-001",
    numero: "2024001",
    cliente: "João Silva",
    email: "julio@email.com",
    telefone: "(11) 99999-9999",
    data: "2024-01-15T14:30:00Z",
    status: "pendente",
    total: 450.0,
    frete: 25.0,
    desconto: 22.5,
    pagamento: "PIX",
    endereco: {
      rua: "Rua das Flores, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      cep: "01234-567",
      estado: "SP",
    },
    itens: [{ produto: "Produto Premium XYZ", quantidade: 2, preco: 225.0, total: 450.0 }],
  },
  {
    id: "PED-003",
    numero: "2024003",
    cliente: "Carlos Oliveira",
    email: "carlos@email.com",
    telefone: "(11) 77777-7777",
    data: "2024-01-14T16:45:00Z",
    status: "enviado",
    total: 675.0,
    frete: 30.0,
    desconto: 33.75,
    pagamento: "PIX",
    endereco: {
      rua: "Rua Augusta, 789",
      bairro: "Consolação",
      cidade: "São Paulo",
      cep: "01305-000",
      estado: "SP",
    },
    itens: [{ produto: "Produto Premium XYZ", quantidade: 3, preco: 225.0, total: 675.0 }],
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

export default function DistribuidorPedidosPage() {
  return <PedidosPage userRole="distribuidor" title="Meus Pedidos" description="Gerencie os pedidos da sua loja" />
}
