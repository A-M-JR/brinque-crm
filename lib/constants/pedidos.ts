export const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800",
  processando: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  entregue: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
}

export const statusLabels = {
  pendente: "Pendente",
  processando: "Processando",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
}

export const mockProdutos = [
  { id: 1, nome: "Produto Premium XYZ", preco: 225.0 },
  { id: 2, nome: "Produto Especial ABC", preco: 280.0 },
  { id: 3, nome: "Produto Standard DEF", preco: 150.0 },
]

export const formasPagamento = [
  { value: "PIX", label: "PIX" },
  { value: "Cartão de Crédito", label: "Cartão de Crédito" },
  { value: "Cartão de Débito", label: "Cartão de Débito" },
  { value: "Boleto", label: "Boleto" },
]
