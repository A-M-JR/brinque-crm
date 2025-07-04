"use client"

import { ClientesPage } from "@/components/clientes/clientes-page"

export default function RevendedorClientesPage() {
  return (
    <ClientesPage userRole="revendedor" title="Meus Clientes" description="Gerencie seus clientes" userId="REV-001" />
  )
}
