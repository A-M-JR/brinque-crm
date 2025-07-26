"use client"

import { type User, authenticateUser } from "@/lib/data/users"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

let currentUser: User | null = null

export function login(email: string, password: string): User | null {
  const user = authenticateUser(email, password)
  if (user) {
    currentUser = user
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

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      currentUser = JSON.parse(stored)
      return currentUser
    }
  }

  return null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function hasPermission(permission: string): boolean {
  const user = getCurrentUser()
  if (!user || !Array.isArray(user.permissions)) return false

  // Admin tem todas as permissões
  if (user.role === "admin" || user.permissions.includes("all")) {
    return true
  }

  return user.permissions.includes(permission)
}
export function getUserRole(): string {
  const user = getCurrentUser()
  return user?.role || "user"
}
