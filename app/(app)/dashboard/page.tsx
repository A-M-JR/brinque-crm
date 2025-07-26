"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend, Tooltip as RechartsTooltip
} from "recharts"
import {
  TrendingUp, TrendingDown, Users, ShoppingCart,
  Package, DollarSign, PlusCircle
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

// Seus dados (mantidos como no original)
const salesData = [
  { month: "Jan", vendas: 4000, pedidos: 2400, clientes: 120 },
  { month: "Fev", vendas: 3000, pedidos: 1980, clientes: 98 },
  { month: "Mar", vendas: 2000, pedidos: 1800, clientes: 89 },
  { month: "Abr", vendas: 2780, pedidos: 2080, clientes: 103 },
  { month: "Mai", vendas: 1890, pedidos: 1890, clientes: 95 },
  { month: "Jun", vendas: 2390, pedidos: 2390, clientes: 119 },
  { month: "Jul", vendas: 3490, pedidos: 3490, clientes: 174 },
]

const revenueData = [
  { name: "Jan", receita: 45000 },
  { name: "Fev", receita: 52000 },
  { name: "Mar", receita: 48000 },
  { name: "Abr", receita: 61000 },
  { name: "Mai", receita: 55000 },
  { name: "Jun", receita: 67000 },
  { name: "Jul", receita: 72000 },
]

const categoryData = [
  { name: "Eletrônicos", value: 400, color: "hsl(var(--primary))" },
  { name: "Roupas", value: 300, color: "hsl(var(--primary) / 0.8)" },
  { name: "Casa", value: 300, color: "hsl(var(--primary) / 0.6)" },
  { name: "Esportes", value: 200, color: "hsl(var(--primary) / 0.4)" },
]

const topProducts = [
  { name: "iPhone 15", vendas: 245, receita: "R$ 245.000" },
  { name: "Samsung Galaxy S24", vendas: 189, receita: "R$ 189.000" },
  { name: "MacBook Air", vendas: 156, receita: "R$ 312.000" },
  { name: "AirPods Pro", vendas: 134, receita: "R$ 67.000" },
  { name: "iPad Air", vendas: 98, receita: "R$ 147.000" },
]

export default function Dashboard() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-muted/40">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Visão geral do seu negócio.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Venda
          </Button>
          <Badge variant="outline">
            Atualizado há 5 min
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 72.540,00</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12.5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        {/* Outros KPI Cards permanecem iguais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1.234</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+892</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +15.3% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.456</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -2.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Vendas por Mês</CardTitle>
            <CardDescription>Evolução de receita ao longo do ano</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{
              receita: { label: "Receita", color: "#8884d8" },
            }}>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="receita" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorReceita)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
            <CardDescription>Distribuição de vendas por categoria de produto</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              receita: { label: "Receita", color: "#8884d8" },
            }}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            {/* ...legenda continua igual */}
          </CardContent>
        </Card>
      </div>


      {/* Bottom Grid with Top Products Table */}
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top 5 produtos com melhor performance este mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Vendas</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                    </TableCell>
                    <TableCell className="text-center">{product.vendas}</TableCell>
                    <TableCell className="text-right">{product.receita}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}