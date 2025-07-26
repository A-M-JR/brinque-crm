"use client"

import { useRouter } from "next/navigation"
import { Bell, Search, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout } from "@/lib/auth/logout"

interface HeaderProps {
  userRole: string
  userName: string
}

export function Header({ userRole, userName }: HeaderProps) {
  const router = useRouter()

  // Função para logout e redirect
  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-4">
        {/* Search (desktop) */}
        <div className="relative hidden sm:block w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-9 w-full bg-muted/60"
          />
        </div>
        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Buscar</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
              <span className="sr-only">Notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="p-2 text-sm border rounded">
                <p className="font-medium">Novo pedido recebido</p>
                <p className="text-xs text-muted-foreground">Pedido #1234 - há 5 minutos</p>
              </div>
              <div className="p-2 text-sm border rounded">
                <p className="font-medium">Pagamento aprovado</p>
                <p className="text-xs text-muted-foreground">Cliente João Silva - há 1 hora</p>
              </div>
              <div className="p-2 text-sm border rounded">
                <p className="font-medium">Estoque baixo</p>
                <p className="text-xs text-muted-foreground">Produto iPhone 15 - há 2 horas</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-blue-600 cursor-pointer">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userName} />
                <AvatarFallback>
                  {(userName ?? "")
                    .split(" ")
                    .map(n => n[0])
                    .join("") || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
