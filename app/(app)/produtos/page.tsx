"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Search, Package, CheckCircle, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { Product, listarProdutosPorFranchise, criarProduto } from '@/lib/supabase/products';
import { Franchise, listarFranchisesVisiveis } from '@/lib/supabase/franchises';

// --- Componente de Cartão de Estatística ---
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
  const { group, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const moduleKey = 'produtos';

    return {
      canView: hasPermission(moduleKey, 'view', groupPermissions, franchiseModules),
      canEdit: hasPermission(moduleKey, 'edit', groupPermissions, franchiseModules),
    }
  }, [group, franchise]);

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchProdutos = useCallback(async () => {
    if (!selectedFranchiseId) return;
    setLoading(true);
    try {
      const data = await listarProdutosPorFranchise(selectedFranchiseId);
      setProdutos(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFranchiseId]);

  useEffect(() => {
    if (!authLoading && permissions.canView) {
      fetchProdutos();
    }
  }, [authLoading, permissions.canView, fetchProdutos]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !permissions.canView)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, permissions.canView, router]);

  const handleCreateAndEdit = async () => {
    if (!selectedFranchiseId) return;
    try {
      const novoProduto = await criarProduto({
        name: 'Novo Produto (rascunho)',
        price: 0.00,
        status: false,
        show_on_store: false,
        franchise_id: selectedFranchiseId
      } as any);

      if (novoProduto && novoProduto.id) {
        router.push(`/produtos/${novoProduto.id}`);
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  };

  const handleEdit = (produtoId: number) => {
    router.push(`/produtos/${produtoId}`);
  };

  const stats = useMemo(() => ({
    total: produtos.length,
    active: produtos.filter(p => p.status).length,
    visibleOnStore: produtos.filter(p => p.show_on_store).length,
  }), [produtos]);

  const filteredProdutos = produtos.filter(produto =>
    produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (produto.sku && produto.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading || !permissions.canView) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
        {franchise?.id === 1 && (
          <div className="flex items-center gap-2">
            <Label htmlFor="franchise-select" className="shrink-0">Visualizando Empresa:</Label>
            <Select
              value={selectedFranchiseId?.toString()}
              onValueChange={(value) => setSelectedFranchiseId(Number(value))}
            >
              <SelectTrigger id="franchise-select" className="w-[250px]"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {franchises.map(f => (
                  <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total de Produtos" value={stats.total} icon={<Package className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Produtos Ativos" value={stats.active} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Visíveis na Loja" value={stats.visibleOnStore} icon={<Eye className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Catálogo de Produtos</CardTitle>
              <CardDescription>Visualize e gerencie os produtos do seu catálogo.</CardDescription>
            </div>
            {permissions.canEdit && (
              <Button onClick={handleCreateAndEdit}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
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
                    <TableCell>{produto.sku || 'N/A'}</TableCell>
                    <TableCell>R$ {produto.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={produto.inventory && produto.inventory.quantity <= produto.inventory.min_stock_level ? 'text-red-500 font-bold' : ''}>
                        {produto.inventory?.quantity ?? 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={produto.status ? 'default' : 'secondary'}>
                        {produto.status ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {permissions.canEdit && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(produto.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Nenhum produto encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
