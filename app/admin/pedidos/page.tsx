"use client"

import { PedidosPage } from "@/components/pedidos/pedidos-page"

export default function AdminPedidosPage() {
  return (
    <PedidosPage
      userRole="admin"
      title="Gerenciar Pedidos"
      description="Visualize e gerencie todos os pedidos do sistema"
    />
  )
}
