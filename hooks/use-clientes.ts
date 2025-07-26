"use client"

import { useState, useEffect } from "react"

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  cpf?: string
  cnpj?: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  status: "ativo" | "inativo" | "bloqueado"
  dataRegistro: string
  ultimaCompra?: string
  totalCompras: number
  distribuidorId?: string
  revendedorId?: string
}

export interface NovoCliente {
  nome: string
  email: string
  telefone: string
  cpf?: string
  cnpj?: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
}

// Mock data baseado no role do usuário
const mockClientesData = {
  admin: [
    {
      id: "CLI-001",
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      endereco: {
        rua: "Rua das Flores",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      },
      status: "ativo" as const,
      dataRegistro: "2024-01-15T10:00:00Z",
      ultimaCompra: "2024-01-20T14:30:00Z",
      totalCompras: 2450.0,
      distribuidorId: "DIST-001",
      revendedorId: "REV-001",
    },
    {
      id: "CLI-002",
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "(11) 88888-8888",
      cnpj: "12.345.678/0001-90",
      endereco: {
        rua: "Av. Paulista",
        numero: "456",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01310-100",
      },
      status: "ativo" as const,
      dataRegistro: "2024-01-10T09:15:00Z",
      ultimaCompra: "2024-01-18T16:45:00Z",
      totalCompras: 3200.0,
      distribuidorId: "DIST-002",
      revendedorId: "REV-002",
    },
    {
      id: "CLI-003",
      nome: "Carlos Oliveira",
      email: "carlos@email.com",
      telefone: "(11) 77777-7777",
      cpf: "987.654.321-00",
      endereco: {
        rua: "Rua Augusta",
        numero: "789",
        bairro: "Consolação",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01305-000",
      },
      status: "inativo" as const,
      dataRegistro: "2024-01-05T11:20:00Z",
      totalCompras: 1800.0,
      distribuidorId: "DIST-001",
      revendedorId: "REV-001",
    },
  ],
  distribuidor: [
    {
      id: "CLI-001",
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      endereco: {
        rua: "Rua das Flores",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      },
      status: "ativo" as const,
      dataRegistro: "2024-01-15T10:00:00Z",
      ultimaCompra: "2024-01-20T14:30:00Z",
      totalCompras: 2450.0,
      revendedorId: "REV-001",
    },
    {
      id: "CLI-003",
      nome: "Carlos Oliveira",
      email: "carlos@email.com",
      telefone: "(11) 77777-7777",
      cpf: "987.654.321-00",
      endereco: {
        rua: "Rua Augusta",
        numero: "789",
        bairro: "Consolação",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01305-000",
      },
      status: "inativo" as const,
      dataRegistro: "2024-01-05T11:20:00Z",
      totalCompras: 1800.0,
      revendedorId: "REV-001",
    },
  ],
  revendedor: [
    {
      id: "CLI-001",
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      endereco: {
        rua: "Rua das Flores",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      },
      status: "ativo" as const,
      dataRegistro: "2024-01-15T10:00:00Z",
      ultimaCompra: "2024-01-20T14:30:00Z",
      totalCompras: 2450.0,
    },
  ],
}

export function useClientes(userRole: "admin" | "distribuidor" | "revendedor", userId?: string) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula carregamento de dados filtrados por role
    const loadClientes = async () => {
      setLoading(true)

      // Simula delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Filtra dados baseado no role
      let clientesFiltrados = mockClientesData[userRole] || []

      // Para distribuidor e revendedor, filtra por ID (simulado)
      if (userRole === "distribuidor" && userId) {
        clientesFiltrados = clientesFiltrados.filter(
          (cliente) => cliente.distribuidorId === userId || !cliente.distribuidorId,
        )
      } else if (userRole === "revendedor" && userId) {
        clientesFiltrados = clientesFiltrados.filter(
          (cliente) => cliente.revendedorId === userId || !cliente.revendedorId,
        )
      }

      setClientes(clientesFiltrados)
      setLoading(false)
    }

    loadClientes()
  }, [userRole, userId])

  const clientesFiltrados = clientes.filter((cliente) => {
    const matchStatus = filtroStatus === "todos" || cliente.status === filtroStatus
    const matchBusca =
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase()) ||
      (cliente.cpf && cliente.cpf.includes(busca)) ||
      (cliente.cnpj && cliente.cnpj.includes(busca))
    return matchStatus && matchBusca
  })

  const atualizarStatus = (clienteId: string, novoStatus: Cliente["status"]) => {
    setClientes((prev) =>
      prev.map((cliente) => (cliente.id === clienteId ? { ...cliente, status: novoStatus } : cliente)),
    )
  }

  const criarCliente = (novoCliente: NovoCliente) => {
    const novoId = `CLI-${String(clientes.length + 1).padStart(3, "0")}`

    const clienteCriado: Cliente = {
      id: novoId,
      ...novoCliente,
      status: "ativo",
      dataRegistro: new Date().toISOString(),
      totalCompras: 0,
    }

    setClientes((prev) => [clienteCriado, ...prev])
  }

  const estatisticas = {
    total: clientes.length,
    ativos: clientes.filter((c) => c.status === "ativo").length,
    inativos: clientes.filter((c) => c.status === "inativo").length,
    bloqueados: clientes.filter((c) => c.status === "bloqueado").length,
    faturamentoTotal: clientes.reduce((acc, c) => acc + c.totalCompras, 0),
  }

  return {
    clientes,
    clientesFiltrados,
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    loading,
    atualizarStatus,
    criarCliente,
    estatisticas,
  }
}
