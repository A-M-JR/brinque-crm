export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  permissions: string[]
}

const users: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@sistema.com",
    role: "admin",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Gerente",
    email: "gerente@sistema.com",
    role: "manager",
    permissions: [
      "clientes",
      "pedidos",
      "vendas",
      "estoque",
      "loja",
      "leads",
      "pagamentos",
      "plataformas",
      "relatorios",
    ],
  },
  {
    id: "3",
    name: "Distribuidor",
    email: "distribuidor@sistema.com",
    role: "user",
    permissions: ["clientes", "pedidos", "vendas", "estoque", "loja", "produtos"],
  },
  {
    id: "4",
    name: "Revendedor",
    email: "revendedor@sistema.com",
    role: "user",
    permissions: ["clientes", "pedidos", "vendas", "loja", "produtos"],
  },
  {
    id: "5",
    name: "Usuário",
    email: "usuario@sistema.com",
    role: "user",
    permissions: ["clientes", "pedidos"],
  },
]

export function authenticateUser(email: string, password: string): User | null {
  // Simulação simples de autenticação
  const user = users.find((u) => u.email === email)
  if (user && password === "123456") {
    return user
  }
  return null
}

export function getAllUsers(): User[] {
  return users
}

export function getUserById(id: string): User | null {
  return users.find((u) => u.id === id) || null
}
