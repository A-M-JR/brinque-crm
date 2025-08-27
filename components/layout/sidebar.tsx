"use client"

import React, { useState, useMemo, forwardRef, ReactNode, SetStateAction, Dispatch, HTMLAttributes, ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// --- Utilitários e Hooks do seu projeto ---
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { hasPermission } from "@/lib/auth/hasPermission"

// --- Imports dos Ícones (lucide-react) ---
import {
  LayoutDashboard, Users, Package, ShoppingCart, BarChart3, Settings, Store, UserCheck,
  Truck, CreditCard, Building2, Plug, Menu, UserPlus, ShieldCheck, Shield, ChevronDown, LucideProps
} from "lucide-react"

// --- Imports dos Componentes UI (shadcn/ui) ---
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


// --- Tipagem para a estrutura do Menu ---
type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

interface SubMenuItemType {
  title: string;
  href: string;
  icon: IconComponent;
  permission: string;
}

interface MenuItemType {
  title: string;
  href?: string;
  icon: IconComponent;
  permission: string | null;
  subItems?: SubMenuItemType[];
}

interface MenuSectionType {
  title: string;
  items: MenuItemType[];
}


// --- Estrutura de Menu Hierárquica ---
const menuConfig: MenuSectionType[] = [
  {
    title: "Principal",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: null },
      { title: "Clientes", href: "/clientes", icon: UserCheck, permission: "clientes" },
      { title: "Leads", href: "/leads", icon: UserPlus, permission: "leads" },
    ],
  },
  {
    title: "Vendas",
    items: [
      { title: "Pedidos", href: "/pedidos", icon: ShoppingCart, permission: "pedidos" },
      // { title: "Vendas", href: "/vendas", icon: Truck, permission: "vendas" },
      { title: "Lojas", href: "/lojas", icon: Store, permission: "loja" },
      // { title: "Pagamentos", href: "/pagamentos", icon: CreditCard, permission: "pagamentos" },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { title: "Produtos", href: "/produtos", icon: Package, permission: "produtos" },
      { title: "Categorias", href: "/categorias", icon: Package, permission: "produtos" },
      
      { title: "Estoque", href: "/estoque", icon: Package, permission: "estoque" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { title: "Relatórios", href: "/relatorios", icon: BarChart3, permission: "relatorios" },
      {
        title: "Configurações",
        icon: Settings,
        permission: "configuracoes",
        subItems: [
          { title: "Usuários", href: "/usuarios", icon: Users, permission: "usuarios" },
          { title: "Permissões", href: "/permissoes", icon: ShieldCheck, permission: "usuarios" },
          { title: "Grupos de Permissões", href: "/grupos", icon: Shield, permission: "grupos_permissoes" },
          // CORRIGIDO: A permissão para "Empresas" deve ser "empresas"
          { title: "Empresas", href: "/empresas", icon: Building2, permission: "permissoes" },
          // { title: "Integrações", href: "/integracoes", icon: Plug, permission: "integracoes" },
        ],
      },
    ],
  },
];

function SidebarContent() {
  const pathname = usePathname()
  const { group, franchise } = useAuth()
  const groupPermissions = group?.permissions ?? {};
  const franchiseModules = franchise?.modules_enabled ?? [];

  const defaultAccordionValue = useMemo(() => {
    for (const section of menuConfig) {
      for (const item of section.items) {
        if (item.subItems && item.subItems.some(sub => pathname.startsWith(sub.href))) {
          return item.title;
        }
      }
    }
    return undefined;
  }, [pathname]);

  const renderNavItem = (item: MenuItemType) => {
    const Icon = item.icon
    const isActive = pathname === item.href

    return (
      <Link key={item.href} href={item.href!} passHref>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start px-3 py-2 text-sm font-medium",
            isActive && "bg-secondary shadow-sm"
          )}
        >
          <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.title}</span>
        </Button>
      </Link>
    )
  }

  const renderAccordionItem = (item: MenuItemType) => {
    const Icon = item.icon;

    // Filtra apenas os sub-itens que o usuário pode VISUALIZAR
    const visibleSubItems = item.subItems!.filter(sub =>
      hasPermission(sub.permission, 'view', groupPermissions, franchiseModules)
    );

    // Não renderiza o Acordeão se não houver sub-itens visíveis.
    if (visibleSubItems.length === 0) {
      return null;
    }

    return (
      <AccordionItem value={item.title} key={item.title} className="border-b-0">
        <AccordionTrigger className="w-full justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted hover:no-underline">
          <div className="flex items-center">
            <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-6 pb-1 pt-0">
          <div className="flex flex-col space-y-1">
            {visibleSubItems.map(subItem => {
              const SubIcon = subItem.icon
              const isSubActive = pathname === subItem.href
              return (
                <Link key={subItem.href} href={subItem.href} passHref>
                  <Button
                    variant={isSubActive ? "secondary" : "ghost"}
                    className="w-full justify-start px-3 py-2 h-9 text-xs font-medium"
                    size="sm"
                  >
                    <SubIcon className="mr-2 h-4 w-4" />
                    {subItem.title}
                  </Button>
                </Link>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 gap-2">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Package className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline tracking-tight">CRM System</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <Accordion type="single" collapsible defaultValue={defaultAccordionValue}>
          <nav className="flex flex-col gap-4">
            {menuConfig.map((section) => {
              // Lógica de filtragem ATUALIZADA para usar a nova função hasPermission
              const visibleItemsInSection = section.items.filter(item => {
                if (item.permission === null) return true;

                // Verifica se o usuário pode VISUALIZAR o item principal
                const hasAccess = hasPermission(item.permission, 'view', groupPermissions, franchiseModules);
                if (!hasAccess) return false;

                // Se for um acordeão, verifica se há pelo menos um sub-item visível
                if (item.subItems) {
                  return item.subItems.some(sub =>
                    hasPermission(sub.permission, 'view', groupPermissions, franchiseModules)
                  );
                }

                return true;
              });

              if (visibleItemsInSection.length === 0) return null;

              return (
                <div key={section.title}>
                  <h3 className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {visibleItemsInSection.map((item) =>
                      item.subItems ? renderAccordionItem(item) : renderNavItem(item)
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        </Accordion>
      </ScrollArea>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden fixed top-4 left-4 z-50 bg-background shadow-md"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-64 border-r bg-background z-50">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu Principal</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-background border-r">
        <SidebarContent />
      </div>
    </>
  );
}
