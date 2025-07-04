// Dados mockados para demonstração do sistema

export const mockLeads = [
  {
    id: "1",
    name: "João Silva",
    email: "julio.silva@email.com",
    phone: "(11) 99999-9999",
    source: "Site Principal",
    status: "novo",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 88888-8888",
    source: "Facebook Ads",
    status: "contatado",
    created_at: "2024-01-14T15:45:00Z",
  },
]

export const mockProducts = [
  {
    id: "1",
    name: "Produto Premium XYZ",
    description: "Produto de alta qualidade com excelente custo-benefício",
    price: 225.0,
    stock: 150,
    category: "Eletrônicos",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Produto Especial ABC",
    description: "Produto especial para clientes exigentes",
    price: 180.0,
    stock: 89,
    category: "Casa e Jardim",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export const mockSales = [
  {
    id: "1",
    customer_name: "João Silva",
    product_name: "Produto XYZ",
    quantity: 2,
    total: 450.0,
    status: "concluída",
    created_at: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    customer_name: "Ana Costa",
    product_name: "Produto ABC",
    quantity: 1,
    total: 280.0,
    status: "processando",
    created_at: "2024-01-15T10:15:00Z",
  },
]

export const mockPayments = [
  {
    id: "1",
    distribuidor_name: "João Silva",
    amount: 2450.0,
    due_date: "2024-01-20",
    status: "pendente",
    days_overdue: 15,
  },
  {
    id: "2",
    distribuidor_name: "Carlos Mendes",
    amount: 1890.0,
    due_date: "2024-01-25",
    status: "pendente",
    days_overdue: 7,
  },
]
