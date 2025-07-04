"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { NovoCliente } from "@/hooks/use-clientes"

interface NovoClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (cliente: NovoCliente) => void
}

export function NovoClienteDialog({ open, onOpenChange, onSubmit }: NovoClienteDialogProps) {
  const [novoCliente, setNovoCliente] = useState<NovoCliente>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    cnpj: "",
    endereco: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  })

  const handleSubmit = () => {
    onSubmit(novoCliente)
    setNovoCliente({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      cnpj: "",
      endereco: {
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>Cadastre um novo cliente no sistema</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente((prev) => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoCliente.email}
                  onChange={(e) => setNovoCliente((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novoCliente.telefone}
                  onChange={(e) => setNovoCliente((prev) => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={novoCliente.cpf}
                    onChange={(e) => setNovoCliente((prev) => ({ ...prev, cpf: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={novoCliente.cnpj}
                    onChange={(e) => setNovoCliente((prev) => ({ ...prev, cnpj: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="rua">Rua</Label>
                  <Input
                    id="rua"
                    value={novoCliente.endereco.rua}
                    onChange={(e) =>
                      setNovoCliente((prev) => ({
                        ...prev,
                        endereco: { ...prev.endereco, rua: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={novoCliente.endereco.numero}
                    onChange={(e) =>
                      setNovoCliente((prev) => ({
                        ...prev,
                        endereco: { ...prev.endereco, numero: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={novoCliente.endereco.bairro}
                  onChange={(e) =>
                    setNovoCliente((prev) => ({
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
                    value={novoCliente.endereco.cidade}
                    onChange={(e) =>
                      setNovoCliente((prev) => ({
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
                    value={novoCliente.endereco.estado}
                    onChange={(e) =>
                      setNovoCliente((prev) => ({
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
                  value={novoCliente.endereco.cep}
                  onChange={(e) =>
                    setNovoCliente((prev) => ({
                      ...prev,
                      endereco: { ...prev.endereco, cep: e.target.value },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Criar Cliente</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
