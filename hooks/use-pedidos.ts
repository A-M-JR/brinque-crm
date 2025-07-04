"use client"

import { useState } from "react"

export interface Pedido {
  id: string
  numero: string
  cliente: string
  email: string
  telefone: string
  loja?: string
  vendedor?: string
  data: string
  status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado"
  total: number
  frete: number
  desconto: number
  pagamento: string
  endereco: {
    rua: string
    bairro: string
    cidade: string
    cep: string
    estado: string
  }
  itens: Array<{
    produto: string
    quantidade: number
    preco: number
    total: number
  }>
}

export interface NovoPedido {
  cliente: string
  email: string
  telefone: string
  loja?: string
  vendedor?: string
  pagamento: string
  frete: number
  desconto: number
  endereco: {
    rua: string
    bairro: string
    cidade: string
    cep: string
    estado: string
  }
  itens: Array<{
    produto: string
    quantidade: number
    preco: number
  }>
}

const mockPedidosData = {
  admin: [
    {
      id: "PED-001",
      numero: "2024001",
      cliente: "João Silva",
      email: "julio@email.com",
      telefone: "(11) 99999-9999",
      loja: "Loja João Silva",
      vendedor: "João Silva (Distribuidor)",
      data: "2024-01-15T14:30:00Z",
      status: "pendente" as const,
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
      id: "PED-002",
      numero: "2024002",
      cliente: "Maria Santos",
      email: "maria@email.com",
      telefone: "(11) 88888-8888",
      loja: "Loja Maria Santos",
      vendedor: "Maria Santos (Revendedor)",
      data: "2024-01-15T10:15:00Z",
      status: "processando" as const,
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
      id: "PED-003",
      numero: "2024003",
      cliente: "Carlos Oliveira",
      email: "carlos@email.com",
      telefone: "(11) 77777-7777",
      loja: "Loja João Silva",
      vendedor: "João Silva (Distribuidor)",
      data: "2024-01-14T16:45:00Z",
      status: "enviado" as const,
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
    {
      id: "PED-004",
      numero: "2024004",
      cliente: "Ana Costa",
      email: "ana@email.com",
      telefone: "(11) 66666-6666",
      loja: "Loja Maria Santos",
      vendedor: "Maria Santos (Revendedor)",
      data: "2024-01-14T09:20:00Z",
      status: "entregue" as const,
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
  ],
  distribuidor: [
    {
      id: "PED-001",
      numero: "2024001",
      cliente: "João Silva",
      email: "julio@email.com",
      telefone: "(11) 99999-9999",
      data: "2024-01-15T14:30:00Z",
      status: "pendente" as const,
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
      status: "enviado" as const,
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
  ],
  revendedor: [
    {
      id: "PED-002",
      numero: "2024002",
      cliente: "Maria Santos",
      email: "maria@email.com",
      telefone: "(11) 88888-8888",
      data: "2024-01-15T10:15:00Z",
      status: "processando" as const,
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
      status: "entregue" as const,
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
  ],
}

export function usePedidos(userRole: "admin" | "distribuidor" | "revendedor") {
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidosData[userRole])
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [busca, setBusca] = useState("")

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchStatus = filtroStatus === "todos" || pedido.status === filtroStatus
    const matchBusca =
      pedido.numero.toLowerCase().includes(busca.toLowerCase()) ||
      pedido.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      pedido.email.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  const atualizarStatus = (pedidoId: string, novoStatus: Pedido["status"]) => {
    setPedidos((prev) => prev.map((pedido) => (pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido)))
  }

  const criarPedido = (novoPedido: NovoPedido) => {
    const novoId = `PED-${String(pedidos.length + 1).padStart(3, "0")}`
    const novoNumero = `2024${String(pedidos.length + 1).padStart(3, "0")}`

    const subtotal = novoPedido.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
    const total = subtotal + novoPedido.frete - novoPedido.desconto

    const pedidoCriado: Pedido = {
      id: novoId,
      numero: novoNumero,
      ...novoPedido,
      data: new Date().toISOString(),
      status: "pendente",
      total,
      itens: novoPedido.itens.map((item) => ({
        ...item,
        total: item.preco * item.quantidade,
      })),
    }

    setPedidos((prev) => [pedidoCriado, ...prev])
  }

  const estatisticas = {
    total: pedidos.length,
    pendentes: pedidos.filter((p) => p.status === "pendente").length,
    processando: pedidos.filter((p) => p.status === "processando").length,
    enviados: pedidos.filter((p) => p.status === "enviado").length,
    entregues: pedidos.filter((p) => p.status === "entregue").length,
    faturamento: pedidos.reduce((acc, p) => acc + p.total, 0),
  }

  return {
    pedidos,
    pedidosFiltrados,
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    atualizarStatus,
    criarPedido,
    estatisticas,
  }
}
