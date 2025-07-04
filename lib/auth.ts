"use client"

import { type User, authenticateUser } from "@/lib/data/users"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Simulação de contexto de autenticação
let currentUser: User | null = null

export function login(email: string, password: string): User | null {
  const user = authenticateUser(email, password)
  if (user) {
    currentUser = user
    // Em uma aplicação real, você salvaria no localStorage ou cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
    return user
  }
  return null
}

export function logout(): void {
  currentUser = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

export function getCurrentUser(): User | null {
  if (currentUser) {
    return currentUser
  }

  // Tentar recuperar do localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      currentUser = JSON.parse(stored)
      return currentUser
    }
  }

  return null
}

export function hasPermission(requiredRole: "admin" | "distribuidor" | "revendedor"): boolean {
  const user = getCurrentUser()
  if (!user) return false

  // Admin tem acesso a tudo
  if (user.role === "admin") return true

  // Distribuidor tem acesso a distribuidor e revendedor
  if (user.role === "distribuidor" && (requiredRole === "distribuidor" || requiredRole === "revendedor")) {
    return true
  }

  // Revendedor só tem acesso a revendedor
  if (user.role === "revendedor" && requiredRole === "revendedor") {
    return true
  }

  return false
}
