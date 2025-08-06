"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Inbox } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardData, DashboardData } from "@/lib/supabase/dashboard";
import { Franchise, listarFranchisesVisiveis } from '@/lib/supabase/franchises';

// --- Componente de Cartão de Estatística ---
const StatCard = ({ title, value, change, changeType, icon }: { title: string, value: string, change: string, changeType: 'increase' | 'decrease', icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center">
        {changeType === 'increase' ?
          <TrendingUp className="h-3 w-3 mr-1 text-green-500" /> :
          <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
        }
        {change} em relação ao mês passado
      </p>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);

  // Define a empresa selecionada inicial e carrega a lista de empresas para o admin
  useEffect(() => {
    if (franchise?.id) {
      setSelectedFranchiseId(franchise.id);
      if (franchise.id === 1) { // Super admin
        listarFranchisesVisiveis(franchise.id).then(setFranchises);
      }
    }
  }, [franchise?.id]);

  const fetchData = useCallback(async () => {
    if (!selectedFranchiseId) return;
    setLoadingData(true);
    try {
      const data = await getDashboardData(selectedFranchiseId);
      setDashboardData(data);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setDashboardData(null); // Limpa dados em caso de erro
    } finally {
      setLoadingData(false);
    }
  }, [selectedFranchiseId]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, fetchData]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loadingData) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <Skeleton className="h-96 col-span-4" />
          <Skeleton className="h-96 col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-muted/40">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Visão geral do negócio da empresa selecionada.</p>
        </div>
        {franchise?.id === 1 && (
          <div className="flex items-center gap-2">
            <Label htmlFor="franchise-select" className="shrink-0">Visualizando Empresa:</Label>
            <Select value={selectedFranchiseId?.toString()} onValueChange={(value) => setSelectedFranchiseId(Number(value))}>
              <SelectTrigger id="franchise-select" className="w-[250px]"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{franchises.map(f => (<SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* KPI Cards Dinâmicos */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardData?.kpis.map((kpi, index) => {
          const icons = [<DollarSign />, <Users />, <ShoppingCart />, <Inbox />];
          return <StatCard key={index} title={kpi.title} value={kpi.value} change={kpi.change} changeType={kpi.changeType} icon={icons[index % icons.length]} />;
        })}
      </div>

      {/* Gráficos Dinâmicos */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Vendas por Mês</CardTitle>
            <CardDescription>Evolução de receita ao longo do ano.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{ receita: { label: "Receita", color: "hsl(var(--primary))" } }}>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dashboardData?.revenueByMonth}>
                  <defs><linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
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
            <CardDescription>Distribuição de vendas por categoria de produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie data={dashboardData?.salesByCategory} cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#8884d8" dataKey="value" labelLine={false}>
                    {dashboardData?.salesByCategory.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Top Produtos Dinâmica */}
      <Card>
        <CardHeader><CardTitle>Produtos Mais Vendidos</CardTitle></CardHeader>
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
              {dashboardData?.topProducts.map((product) => (
                <TableRow key={product.name}>
                  <TableCell><div className="font-medium">{product.name}</div></TableCell>
                  <TableCell className="text-center">{product.vendas}</TableCell>
                  <TableCell className="text-right">{product.receita}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
