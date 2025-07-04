export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "distribuidor" | "revendedor"
  avatar?: string
  distribuidor_responsavel?: string // Para revendedores
}

export const users: User[] = [
  // Administradores
  {
    id: "1",
    name: "Admin Sistema",
    email: "admin@crmsaas.com",
    password: "admin123",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Super Admin",
    email: "superadmin@crmsaas.com",
    password: "super123",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },

  // Distribuidores
  {
    id: "3",
    name: "João Silva",
    email: "julio@distribuidor.com",
    password: "dist123",
    role: "distribuidor",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Carlos Mendes",
    email: "carlos@distribuidor.com",
    password: "dist123",
    role: "distribuidor",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Ana Paula",
    email: "ana@distribuidor.com",
    password: "dist123",
    role: "distribuidor",
    avatar: "/placeholder.svg?height=40&width=40",
  },

  // Revendedores
  {
    id: "6",
    name: "Maria Santos",
    email: "maria@revendedor.com",
    password: "rev123",
    role: "revendedor",
    distribuidor_responsavel: "3", // João Silva
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Pedro Lima",
    email: "pedro@revendedor.com",
    password: "rev123",
    role: "revendedor",
    distribuidor_responsavel: "3", // João Silva
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Lucia Costa",
    email: "lucia@revendedor.com",
    password: "rev123",
    role: "revendedor",
    distribuidor_responsavel: "4", // Carlos Mendes
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "9",
    name: "Roberto Oliveira",
    email: "roberto@revendedor.com",
    password: "rev123",
    role: "revendedor",
    distribuidor_responsavel: "5", // Ana Paula
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export function authenticateUser(email: string, password: string): User | null {
  const user = getUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}

export function getUsersByRole(role: "admin" | "distribuidor" | "revendedor"): User[] {
  return users.filter((user) => user.role === role)
}

export function getRevendedoresByDistribuidor(distribuidorId: string): User[] {
  return users.filter((user) => user.role === "revendedor" && user.distribuidor_responsavel === distribuidorId)
}
