"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Layout,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Store,
  UserCheck,
  Truck,
  CreditCard,
  Building2,
  Plug,
  Menu,
} from "lucide-react"

interface SidebarProps {
  userRole: "admin" | "distribuidor" | "revendedor"
}

const menuItems = {
  admin: [
    { title: "", href: "/admin/", icon: Layout },
    { title: "Usuários", href: "/admin/usuarios", icon: Users },
    { title: "Clientes", href: "/admin/clientes", icon: UserCheck },
    { title: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
    { title: "Leads", href: "/admin/leads", icon: Users },
    { title: "Pagamentos", href: "/admin/pagamentos", icon: CreditCard },
    { title: "Plataformas", href: "/admin/plataformas", icon: Building2 },
    { title: "Integrações", href: "/admin/integracao", icon: Plug },
    { title: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
    { title: "Configurações", href: "/admin/configuracoes", icon: Settings },
  ],
  distribuidor: [
    { title: "", href: "/distribuidor/", icon: Layout },
    { title: "Clientes", href: "/distribuidor/clientes", icon: UserCheck },
    { title: "Pedidos", href: "/distribuidor/pedidos", icon: ShoppingCart },
    { title: "Produtos", href: "/distribuidor/produtos", icon: Package },
    { title: "Estoque", href: "/distribuidor/estoque", icon: Package },
    { title: "Revendedores", href: "/distribuidor/revendedores", icon: Users },
    { title: "Leads", href: "/distribuidor/leads", icon: Users },
    { title: "Loja", href: "/distribuidor/loja", icon: Store },
    { title: "Indicadores", href: "/distribuidor/indicadores", icon: BarChart3 },
  ],
  revendedor: [
    { title: "", href: "/revendedor/", icon: Layout },
    { title: "Clientes", href: "/revendedor/clientes", icon: UserCheck },
    { title: "Pedidos", href: "/revendedor/pedidos", icon: ShoppingCart },
    { title: "Estoque", href: "/revendedor/estoque", icon: Package },
    { title: "Vendas", href: "/revendedor/vendas", icon: Truck },
    { title: "Loja", href: "/revendedor/loja", icon: Store },
  ],
}

function SidebarContent({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const items = menuItems[userRole]

  return (
    <div className="flex h-full flex-col">
      {/* Logo / Título */}
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-bold text-orange-600 text-lg" href={`/${userRole}/`}>
          <Package className="h-6 w-6" />
          <span>CRM</span>
        </Link>
      </div>

      {/* Lista de itens */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {items.map((item) => {
            if (!item.title) return null
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start font-medium text-sm transition rounded-md",
                    isActive && "bg-orange-100 text-orange-700"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export function Sidebar({ userRole }: SidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Botão Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden fixed top-4 left-4 z-40 bg-white shadow"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-64">
          <SidebarContent userRole={userRole} />
        </SheetContent>
      </Sheet>

      {/* Menu Desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-sm">
        <SidebarContent userRole={userRole} />
      </div>
    </>
  )
}
