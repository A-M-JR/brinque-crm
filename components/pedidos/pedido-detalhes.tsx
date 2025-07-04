"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { statusColors, statusLabels } from "@/lib/constants/pedidos"
import type { Pedido } from "@/hooks/use-pedidos"

interface PedidoDetalhesProps {
  pedido: Pedido
  onStatusChange: (pedidoId: string, novoStatus: Pedido["status"]) => void
  showLoja?: boolean
}

export function PedidoDetalhes({ pedido, onStatusChange, showLoja = false }: PedidoDetalhesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Cliente</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Nome:</strong> {pedido.cliente}
                </p>
                <p>
                  <strong>Email:</strong> {pedido.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {pedido.telefone}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pedido</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Data:</strong> {new Date(pedido.data).toLocaleString("pt-BR")}
                </p>
                {showLoja && pedido.loja && (
                  <>
                    <p>
                      <strong>Loja:</strong> {pedido.loja}
                    </p>
                    <p>
                      <strong>Vendedor:</strong> {pedido.vendedor}
                    </p>
                  </>
                )}
                <p>
                  <strong>Pagamento:</strong> {pedido.pagamento}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>{pedido.endereco.rua}</p>
            <p>{pedido.endereco.bairro}</p>
            <p>
              {pedido.endereco.cidade} - {pedido.endereco.estado}
            </p>
            <p>CEP: {pedido.endereco.cep}</p>
          </div>
        </CardContent>
      </Card>

      {/* Itens do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedido.itens.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status e Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status e Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2">
              Status atual:
              <Badge className={`ml-2 ${statusColors[pedido.status]}`}>{statusLabels[pedido.status]}</Badge>
            </p>
            <div className="flex gap-2 flex-wrap">
              {(["pendente", "processando", "enviado", "entregue", "cancelado"] as const).map((status) => (
                <Button
                  key={status}
                  variant={status === "cancelado" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(pedido.id, status)}
                  disabled={pedido.status === status}
                >
                  {statusLabels[status]}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                R${" "}
                {(pedido.total - pedido.frete + pedido.desconto).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frete:</span>
              <span>R$ {pedido.frete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
            {pedido.desconto > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto:</span>
                <span>-R$ {pedido.desconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>R$ {pedido.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
