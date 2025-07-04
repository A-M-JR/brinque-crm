"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus } from "lucide-react"
import { mockProdutos, formasPagamento } from "@/lib/constants/pedidos"
import type { NovoPedido } from "@/hooks/use-pedidos"

interface NovoPedidoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (pedido: NovoPedido) => void
  showLojaFields?: boolean
}

export function NovoPedidoDialog({ open, onOpenChange, onSubmit, showLojaFields = false }: NovoPedidoDialogProps) {
  const [novoPedido, setNovoPedido] = useState<NovoPedido>({
    cliente: "",
    email: "",
    telefone: "",
    loja: "",
    vendedor: "",
    pagamento: "PIX",
    frete: 0,
    desconto: 0,
    endereco: {
      rua: "",
      bairro: "",
      cidade: "",
      cep: "",
      estado: "",
    },
    itens: [{ produto: "", quantidade: 1, preco: 0 }],
  })

  const adicionarItem = () => {
    setNovoPedido((prev) => ({
      ...prev,
      itens: [...prev.itens, { produto: "", quantidade: 1, preco: 0 }],
    }))
  }

  const removerItem = (index: number) => {
    setNovoPedido((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }))
  }

  const atualizarItem = (index: number, campo: string, valor: any) => {
    setNovoPedido((prev) => ({
      ...prev,
      itens: prev.itens.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)),
    }))
  }

  const calcularTotal = () => {
    const subtotal = novoPedido.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
    return subtotal + novoPedido.frete - novoPedido.desconto
  }

  const handleSubmit = () => {
    onSubmit(novoPedido)
    setNovoPedido({
      cliente: "",
      email: "",
      telefone: "",
      loja: "",
      vendedor: "",
      pagamento: "PIX",
      frete: 0,
      desconto: 0,
      endereco: {
        rua: "",
        bairro: "",
        cidade: "",
        cep: "",
        estado: "",
      },
      itens: [{ produto: "", quantidade: 1, preco: 0 }],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Pedido</DialogTitle>
          <DialogDescription>Preencha as informações do novo pedido</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cliente">Nome do Cliente</Label>
                <Input
                  id="cliente"
                  value={novoPedido.cliente}
                  onChange={(e) => setNovoPedido((prev) => ({ ...prev, cliente: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoPedido.email}
                  onChange={(e) => setNovoPedido((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novoPedido.telefone}
                  onChange={(e) => setNovoPedido((prev) => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
              {showLojaFields && (
                <>
                  <div>
                    <Label htmlFor="loja">Loja</Label>
                    <Input
                      id="loja"
                      value={novoPedido.loja || ""}
                      onChange={(e) => setNovoPedido((prev) => ({ ...prev, loja: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendedor">Vendedor</Label>
                    <Input
                      id="vendedor"
                      value={novoPedido.vendedor || ""}
                      onChange={(e) => setNovoPedido((prev) => ({ ...prev, vendedor: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={novoPedido.endereco.rua}
                  onChange={(e) =>
                    setNovoPedido((prev) => ({
                      ...prev,
                      endereco: { ...prev.endereco, rua: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={novoPedido.endereco.bairro}
                  onChange={(e) =>
                    setNovoPedido((prev) => ({
                      ...prev,
                      endereco: { ...prev.endereco, bairro: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={novoPedido.endereco.cidade}
                    onChange={(e) =>
                      setNovoPedido((prev) => ({
                        ...prev,
                        endereco: { ...prev.endereco, cidade: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={novoPedido.endereco.estado}
                    onChange={(e) =>
                      setNovoPedido((prev) => ({
                        ...prev,
                        endereco: { ...prev.endereco, estado: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={novoPedido.endereco.cep}
                  onChange={(e) =>
                    setNovoPedido((prev) => ({
                      ...prev,
                      endereco: { ...prev.endereco, cep: e.target.value },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {novoPedido.itens.map((item, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Produto</Label>
                    <Select
                      value={item.produto}
                      onValueChange={(value) => {
                        const produto = mockProdutos.find((p) => p.nome === value)
                        atualizarItem(index, "produto", value)
                        if (produto) {
                          atualizarItem(index, "preco", produto.preco)
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProdutos.map((produto) => (
                          <SelectItem key={produto.id} value={produto.nome}>
                            {produto.nome} - R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(index, "quantidade", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="w-32">
                    <Label>Preço</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.preco}
                      onChange={(e) => atualizarItem(index, "preco", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-32">
                    <Label>Total</Label>
                    <Input
                      value={`R$ ${(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                      disabled
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removerItem(index)}
                    disabled={novoPedido.itens.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={adicionarItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </CardContent>
          </Card>

          {/* Informações de Pagamento */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Informações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="pagamento">Forma de Pagamento</Label>
                  <Select
                    value={novoPedido.pagamento}
                    onValueChange={(value) => setNovoPedido((prev) => ({ ...prev, pagamento: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formasPagamento.map((forma) => (
                        <SelectItem key={forma.value} value={forma.value}>
                          {forma.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frete">Frete</Label>
                  <Input
                    id="frete"
                    type="number"
                    step="0.01"
                    value={novoPedido.frete}
                    onChange={(e) =>
                      setNovoPedido((prev) => ({ ...prev, frete: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="desconto">Desconto</Label>
                  <Input
                    id="desconto"
                    type="number"
                    step="0.01"
                    value={novoPedido.desconto}
                    onChange={(e) =>
                      setNovoPedido((prev) => ({ ...prev, desconto: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div>
                  <Label>Total</Label>
                  <Input
                    value={`R$ ${calcularTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Criar Pedido</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
