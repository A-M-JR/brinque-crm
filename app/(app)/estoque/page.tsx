"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, Search, Package, AlertTriangle, DollarSign, History, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { Product, StockMovement, listarProdutosPorFranchise, adicionarMovimentacaoEstoque, atualizarProduto, atualizarInventario, listarMovimentacoesDeEstoque } from '@/lib/supabase/products';
import { Franchise, listarFranchisesVisiveis } from '@/lib/supabase/franchises';
import { PageFeedback } from "@/components/ui/page-loader"

// --- Componentes Internos ---
const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle>{icon}</CardHeader>
    <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
  </Card>
);

export default function EstoquePage() {
  const router = useRouter();
  const { group, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    return {
      canViewEstoque: hasPermission('estoque', 'view', groupPermissions, franchiseModules),
      canEditEstoque: hasPermission('estoque', 'edit', groupPermissions, franchiseModules),
      canEditProdutos: hasPermission('produtos', 'edit', groupPermissions, franchiseModules),
    }
  }, [group, franchise]);

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [adjustment, setAdjustment] = useState({ quantity: 0, reason: 'ajuste_manual', min_stock_level: 0 });

  useEffect(() => {
    if (franchise?.id) {
      setSelectedFranchiseId(franchise.id);
      if (franchise.id === 1) {
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
    if (!authLoading && permissions.canViewEstoque) {
      fetchProdutos();
    }
  }, [authLoading, permissions.canViewEstoque, fetchProdutos]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !permissions.canViewEstoque)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, permissions.canViewEstoque, router]);

  const handleOpenModal = async (product: Product) => {
    setSelectedProduct(product);
    setAdjustment({ quantity: 0, reason: 'ajuste_manual', min_stock_level: product.inventory?.min_stock_level ?? 0 });
    try {
      const movements = await listarMovimentacoesDeEstoque(product.id);
      setStockMovements(movements);
    } catch (error) {
      console.error("Erro ao buscar histórico de movimentações:", error);
      setStockMovements([]);
    }
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      // Salva o nível mínimo de estoque
      await atualizarInventario(selectedProduct.id, { min_stock_level: adjustment.min_stock_level });

      // Se houver uma alteração de quantidade, regista a movimentação
      if (adjustment.quantity !== 0) {
        await adicionarMovimentacaoEstoque(selectedProduct.id, adjustment.quantity, adjustment.reason);
      }

      setSelectedProduct(null);
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao ajustar estoque:", error);
    }
  };

  const handleToggleShowOnStore = async (productId: number, currentValue: boolean) => {
    try {
      await atualizarProduto(productId, { show_on_store: !currentValue });
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao alterar visibilidade do produto:", error);
    }
  };

  const filteredProdutos = useMemo(() => produtos.filter(p => {
    const matchesFilter = (filter === 'all') ||
      (filter === 'low' && p.inventory && p.inventory.quantity <= p.inventory.min_stock_level && p.inventory.quantity > 0) ||
      (filter === 'out' && p.inventory?.quantity === 0);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  }), [produtos, searchTerm, filter]);

  const stats = useMemo(() => {
    const lowStockItems = produtos.filter(p => p.inventory && p.inventory.quantity <= p.inventory.min_stock_level && p.inventory.quantity > 0).length;
    const totalValue = produtos.reduce((acc, p) => acc + (p.price * (p.inventory?.quantity ?? 0)), 0);
    return {
      totalValue: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      lowStockItems,
      distinctItems: produtos.length,
    };
  }, [produtos]);

  const getStockStatusIndicator = (product: Product) => {
    if (!product.inventory) return null;
    const { quantity, min_stock_level } = product.inventory;
    if (quantity <= 0) return <div className="h-2.5 w-2.5 rounded-full bg-red-500" title="Estoque Zerado"></div>;
    if (quantity <= min_stock_level) return <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" title="Estoque Baixo"></div>;
    return <div className="h-2.5 w-2.5 rounded-full bg-green-500" title="Estoque OK"></div>;
  };

  if (authLoading || !permissions.canViewEstoque) {
    return <PageFeedback mode='both' />
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Controle de Estoque</h1>
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

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Valor Total em Estoque" value={stats.totalValue} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Itens com Estoque Baixo" value={stats.lowStockItems} icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Produtos Distintos" value={stats.distinctItems} icon={<Package className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventário de Produtos</CardTitle>
          <CardDescription>Gerencie a quantidade e visibilidade dos seus produtos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou SKU..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>Todos</Button>
              <Button variant={filter === 'low' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('low')}>Estoque Baixo</Button>
              <Button variant={filter === 'out' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('out')}>Estoque Zerado</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead>Estoque Mínimo</TableHead>
                <TableHead>Visível na Loja</TableHead>
                <TableHead className="w-[150px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Carregando inventário...</TableCell></TableRow>
              ) : filteredProdutos.length > 0 ? (
                filteredProdutos.map(produto => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.name}</TableCell>
                    <TableCell><div className="flex items-center gap-2">{getStockStatusIndicator(produto)}<span>{produto.inventory?.quantity ?? 0}</span></div></TableCell>
                    <TableCell>{produto.inventory?.min_stock_level ?? 0}</TableCell>
                    <TableCell><Switch checked={produto.show_on_store} onCheckedChange={() => handleToggleShowOnStore(produto.id, produto.show_on_store)} disabled={!permissions.canEditProdutos} /></TableCell>
                    <TableCell className="text-right">
                      {permissions.canEditEstoque && (
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(produto)}><Wrench className="h-4 w-4 mr-2" />Gerenciar</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Nenhum produto encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProduct} onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Estoque: {selectedProduct?.name}</DialogTitle>
            <DialogDescription>Estoque atual: {selectedProduct?.inventory?.quantity ?? 0}.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="ajuste">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ajuste">Ajustar Estoque</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="ajuste">
              <form onSubmit={handleStockUpdate} className="pt-4 space-y-4">
                <div>
                  <Label htmlFor="min_stock_level">Nível Mínimo de Estoque</Label>
                  <Input id="min_stock_level" type="number" value={adjustment.min_stock_level} onChange={e => setAdjustment(p => ({ ...p, min_stock_level: parseInt(e.target.value, 10) || 0 }))} />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantidade a Movimentar</Label>
                  <Input id="quantity" type="number" value={adjustment.quantity} onChange={e => setAdjustment(p => ({ ...p, quantity: parseInt(e.target.value, 10) || 0 }))} />
                  <p className="text-xs text-muted-foreground mt-1">Use valores positivos para entrada (ex: 10) e negativos para saída (ex: -5).</p>
                </div>
                <div>
                  <Label htmlFor="reason">Motivo</Label>
                  <select id="reason" value={adjustment.reason} onChange={e => setAdjustment(p => ({ ...p, reason: e.target.value }))} className="w-full mt-1 block border rounded-md px-3 py-2 bg-white">
                    <option value="ajuste_manual">Ajuste Manual</option>
                    <option value="entrada_fornecedor">Entrada de Fornecedor</option>
                    <option value="devolucao">Devolução de Cliente</option>
                    <option value="perda_avaria">Perda ou Avaria</option>
                  </select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setSelectedProduct(null)}>Cancelar</Button>
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            </TabsContent>
            <TabsContent value="historico">
              <Table>
                <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Quantidade</TableHead><TableHead>Motivo</TableHead></TableRow></TableHeader>
                <TableBody>
                  {stockMovements.length > 0 ? stockMovements.map(mov => (
                    <TableRow key={mov.id}>
                      <TableCell>{new Date(mov.created).toLocaleString()}</TableCell>
                      <TableCell className={mov.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}>{mov.quantity_change > 0 ? `+${mov.quantity_change}` : mov.quantity_change}</TableCell>
                      <TableCell>{mov.reason}</TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={3} className="text-center h-24">Nenhuma movimentação.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
