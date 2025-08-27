"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Search, Package, CheckCircle, Eye, Star } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { Product, listarProdutosPorFranchise } from '@/lib/supabase/products';
import { Franchise, listarFranchisesVisiveis } from '@/lib/supabase/franchises';
import { Category, listarCategoriasPorFranchise } from '@/lib/supabase/categories';
import { PageFeedback } from "@/components/ui/page-loader";

const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function ProdutosPage() {
  const router = useRouter();
  const { group, franchise, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    return {
      canView: hasPermission('produtos', 'view', groupPermissions, franchiseModules),
      canEdit: hasPermission('produtos', 'edit', groupPermissions, franchiseModules),
    }
  }, [group, franchise]);

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (franchise?.id) {
      setSelectedFranchiseId(franchise.id);
      if (franchise.id === 1) { 
        listarFranchisesVisiveis(franchise.id).then(setFranchises);
      }
      listarCategoriasPorFranchise(franchise.id).then(setCategories);
    }
  }, [franchise?.id]);

  const fetchProdutos = useCallback(async () => {
    if (!selectedFranchiseId) return;
    setLoading(true);
    try {
      const categoryId = categoryFilter === 'all' ? null : parseInt(categoryFilter);
      const data = await listarProdutosPorFranchise(selectedFranchiseId, categoryId);
      setProdutos(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFranchiseId, categoryFilter]);

  useEffect(() => {
    if (!authLoading && permissions.canView) {
      fetchProdutos();
    }
  }, [authLoading, permissions.canView, fetchProdutos]);

  const stats = useMemo(() => ({
    total: produtos.length,
    active: produtos.filter(p => p.status).length,
    visibleOnStore: produtos.filter(p => p.show_on_store).length,
    novidades: produtos.filter(p => p.is_new).length,
  }), [produtos]);

  const filteredProdutos = produtos.filter(produto =>
    produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (produto.sku && produto.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading || !permissions.canView) {
    return <PageFeedback mode='both' />
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
        {franchise?.id === 1 && (
          <div className="flex items-center gap-2">
            <Label htmlFor="franchise-select" className="shrink-0">Visualizando Empresa:</Label>
            {/* 👇 AQUI ESTÁ A CORREÇÃO 👇 */}
            <Select 
              value={selectedFranchiseId?.toString() ?? ''} 
              onValueChange={(value) => setSelectedFranchiseId(Number(value))}
            >
              <SelectTrigger id="franchise-select" className="w-[250px]"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{franchises.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total de Produtos" value={stats.total} icon={<Package className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Produtos Ativos" value={stats.active} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Visíveis na Loja" value={stats.visibleOnStore} icon={<Eye className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Novidades" value={stats.novidades} icon={<Star className="h-4 w-4 text-yellow-500" />} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Catálogo de Produtos</CardTitle>
              <CardDescription>Visualize e gerencie os produtos do seu catálogo.</CardDescription>
            </div>
            {permissions.canEdit && <Button onClick={() => router.push('/produtos/novo')}><Plus className="mr-2 h-4 w-4" />Novo Produto</Button>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou SKU..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[280px]"><SelectValue placeholder="Filtrar por categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24">Carregando produtos...</TableCell></TableRow>
              ) : filteredProdutos.length > 0 ? (
                filteredProdutos.map(produto => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.name}</TableCell>
                    <TableCell>{produto.category?.name || 'N/A'}</TableCell>
                    <TableCell>R$ {produto.price.toFixed(2)}</TableCell>
                    <TableCell>{produto.inventory?.quantity ?? 0}</TableCell>
                    <TableCell><Badge variant={produto.status ? 'default' : 'secondary'}>{produto.status ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                    <TableCell className="text-right">
                      {permissions.canEdit && (
                        <Link href={`/produtos/${produto.id}`} passHref>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center h-24">Nenhum produto encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}