"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, TrendingUp, Users, DollarSign, Package } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from '@/lib/auth/hasPermission';
import { getReportData, ReportData } from "@/lib/supabase/reports";
import { Franchise, listarFranchisesVisiveis } from '@/lib/supabase/franchises';

// --- Componente de Cartão de Estatística ---
const StatCard = ({ title, value, change }: { title: string, value: string, change: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <TrendingUp className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change} em relação ao período anterior</p>
    </CardContent>
  </Card>
);

const chartConfig = {
  vendas: { label: "Vendas", color: "#2563eb" },
  receita: { label: "Receita", color: "#60a5fa" },
  novos: { label: "Novos", color: "#10b981" },
  ativos: { label: "Ativos", color: "#f59e0b" },
};

export default function RelatoriosPage() {
  const router = useRouter();
  const { group, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    return {
      canView: hasPermission('relatorios', 'view', groupPermissions, franchiseModules),
    }
  }, [group, franchise]);

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [periodo, setPeriodo] = useState("6m");

  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);

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
      const data = await getReportData(selectedFranchiseId, periodo);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao carregar dados dos relatórios:", error);
      setReportData(null);
    } finally {
      setLoadingData(false);
    }
  }, [selectedFranchiseId, periodo]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, fetchData]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !permissions.canView)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, permissions.canView, router]);

  if (authLoading || loadingData) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <div className="flex items-center space-x-2">
          {franchise?.id === 1 && (
            <div className="flex items-center gap-2">
              <Label htmlFor="franchise-select" className="shrink-0">Empresa:</Label>
              <Select value={selectedFranchiseId?.toString()} onValueChange={(value) => setSelectedFranchiseId(Number(value))}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{franchises.map(f => (<SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          )}
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Selecione o período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mês</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar</Button>
        </div>
      </div>

      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {reportData?.salesKpis.map(kpi => <StatCard key={kpi.title} title={kpi.title} value={kpi.value} change={kpi.change} />)}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Vendas e Receita por Mês</CardTitle>
              <CardDescription>Evolução das vendas e receita ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData?.salesReportData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="vendas" fill="var(--color-vendas)" radius={4} />
                    <Bar dataKey="receita" fill="var(--color-receita)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {reportData?.userKpis.map(kpi => <StatCard key={kpi.title} title={kpi.title} value={kpi.value} change={kpi.change} />)}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>Novos usuários vs usuários ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData?.userReportData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="novos" stroke="var(--color-novos)" strokeWidth={2} />
                    <Line type="monotone" dataKey="ativos" stroke="var(--color-ativos)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TODO: Implementar as abas de Financeiro e Produtos */}
        <TabsContent value="financeiro"><Card><CardHeader><CardTitle>Relatório Financeiro</CardTitle></CardHeader><CardContent className="text-center p-8">Em desenvolvimento.</CardContent></Card></TabsContent>
        <TabsContent value="produtos"><Card><CardHeader><CardTitle>Relatório de Produtos</CardTitle></CardHeader><CardContent className="text-center p-8">Em desenvolvimento.</CardContent></Card></TabsContent>

      </Tabs>
    </div>
  );
}
