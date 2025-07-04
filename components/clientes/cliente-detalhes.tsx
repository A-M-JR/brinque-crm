"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Cliente } from "@/hooks/use-clientes"

interface ClienteDetalhesProps {
  cliente: Cliente
  onStatusChange: (clienteId: string, novoStatus: Cliente["status"]) => void
  showDistribuidor?: boolean
}

const statusColors = {
  ativo: "bg-green-100 text-green-800",
  inativo: "bg-yellow-100 text-yellow-800",
  bloqueado: "bg-red-100 text-red-800",
}

const statusLabels = {
  ativo: "Ativo",
  inativo: "Inativo",
  bloqueado: "Bloqueado",
}

export function ClienteDetalhes({ cliente, onStatusChange, showDistribuidor = false }: ClienteDetalhesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p>
              <strong>Nome:</strong> {cliente.nome}
            </p>
            <p>
              <strong>Email:</strong> {cliente.email}
            </p>
            <p>
              <strong>Telefone:</strong> {cliente.telefone}
            </p>
            {cliente.cpf && (
              <p>
                <strong>CPF:</strong> {cliente.cpf}
              </p>
            )}
            {cliente.cnpj && (
              <p>
                <strong>CNPJ:</strong> {cliente.cnpj}
              </p>
            )}
            {showDistribuidor && cliente.distribuidorId && (
              <p>
                <strong>Distribuidor:</strong> {cliente.distribuidorId}
              </p>
            )}
            {showDistribuidor && cliente.revendedorId && (
              <p>
                <strong>Revendedor:</strong> {cliente.revendedorId}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg space-y-1">
            <p>
              {cliente.endereco.rua}, {cliente.endereco.numero}
            </p>
            <p>{cliente.endereco.bairro}</p>
            <p>
              {cliente.endereco.cidade} - {cliente.endereco.estado}
            </p>
            <p>CEP: {cliente.endereco.cep}</p>
          </div>
        </CardContent>
      </Card>

      {/* Informações Comerciais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Comerciais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p>
              <strong>Data de Registro:</strong> {new Date(cliente.dataRegistro).toLocaleDateString("pt-BR")}
            </p>
            {cliente.ultimaCompra && (
              <p>
                <strong>Última Compra:</strong> {new Date(cliente.ultimaCompra).toLocaleDateString("pt-BR")}
              </p>
            )}
            <p>
              <strong>Total em Compras:</strong> R${" "}
              {cliente.totalCompras.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status e Ações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status e Ações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2">
              Status atual:
              <Badge className={`ml-2 ${statusColors[cliente.status]}`}>{statusLabels[cliente.status]}</Badge>
            </p>
            <div className="flex gap-2 flex-wrap">
              {(["ativo", "inativo", "bloqueado"] as const).map((status) => (
                <Button
                  key={status}
                  variant={status === "bloqueado" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(cliente.id, status)}
                  disabled={cliente.status === status}
                >
                  {statusLabels[status]}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
