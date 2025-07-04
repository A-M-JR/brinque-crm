"use client"
import { ClientesPage } from "@/components/clientes/clientes-page"

const mockClientes = [
  {
    id: "1",
    nome: "João Silva",
    email: "julio.silva@email.com",
    telefone: "(11) 99999-9999",
    cidade: "São Paulo",
    distribuidor: "João Silva",
    revendedor: "Maria Santos",
    totalCompras: 1250.0,
    ultimaCompra: "2024-01-15",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Ana Costa",
    email: "ana.costa@email.com",
    telefone: "(11) 88888-8888",
    cidade: "Rio de Janeiro",
    distribuidor: "Carlos Mendes",
    revendedor: "Pedro Lima",
    totalCompras: 890.0,
    ultimaCompra: "2024-01-10",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    telefone: "(11) 77777-7777",
    cidade: "Belo Horizonte",
    distribuidor: "Ana Paula",
    revendedor: "Lucia Costa",
    totalCompras: 2100.0,
    ultimaCompra: "2024-01-08",
    status: "vip",
  },
]

export default function AdminClientesPage() {
  return (
    <ClientesPage
      userRole="admin"
      title="Gestão de Clientes"
      description="Gerencie todos os clientes da plataforma"
      userId="ADMIN-001"
    />
  )
}
