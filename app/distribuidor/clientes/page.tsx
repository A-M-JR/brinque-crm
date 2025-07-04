"use client"

import { ClientesPage } from "@/components/clientes/clientes-page"

export default function DistribuidorClientesPage() {
  return (
    <ClientesPage
      userRole="distribuidor"
      title="Meus Clientes"
      description="Gerencie os clientes da sua rede"
      userId="DIST-001"
    />
  )
}
