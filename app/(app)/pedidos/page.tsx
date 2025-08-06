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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, ShoppingCart, DollarSign, Clock, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { Order, OrderItem, listarPedidosPorFranchise, buscarPedidoPorId, criarPedido } from '@/lib/supabase/orders';
import { Franchise, listarFranchisesVisiveis } from '@/lib/supabase/franchises';
import { Company, listarCompaniesPorFranchise } from '@/lib/supabase/companies';
import { Product, listarProdutosPorFranchise } from '@/lib/supabase/products';
import { OrderForm, OrderFormData } from '@/components/pedidos/ordersForm';

// --- Componente de Cartão de Estatística ---
const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle>{icon}</CardHeader>
        <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
    </Card>
);

export default function PedidosPage() {
    const router = useRouter();
    const { user, group, franchise, isAuthenticated, loading: authLoading } = useAuth();

    const permissions = useMemo(() => {
        const groupPermissions = group?.permissions ?? {};
        const franchiseModules = franchise?.modules_enabled ?? [];
        const moduleKey = 'pedidos';

        return {
            canView: hasPermission(moduleKey, 'view', groupPermissions, franchiseModules),
            canEdit: hasPermission(moduleKey, 'edit', groupPermissions, franchiseModules),
        }
    }, [group, franchise]);

    const [pedidos, setPedidos] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);

    // State para os dialogs
    const [viewOrder, setViewOrder] = useState<{ order: Order, items: OrderItem[] } | null>(null);
    const [newOrderDialogOpen, setNewOrderDialogOpen] = useState(false);

    // State para os dados necessários no formulário de novo pedido
    const [customers, setCustomers] = useState<Company[]>([]);
    const [products, setProducts] = useState<Product[]>([]);


    useEffect(() => {
        if (franchise?.id) {
            setSelectedFranchiseId(franchise.id);
            if (franchise.id === 1) { // Super admin
                listarFranchisesVisiveis(franchise.id).then(setFranchises);
            }
        }
    }, [franchise?.id]);

    const fetchPageData = useCallback(async () => {
        if (!selectedFranchiseId) return;
        setLoading(true);
        try {
            const [pedidosData, customersData, productsData] = await Promise.all([
                listarPedidosPorFranchise(selectedFranchiseId),
                listarCompaniesPorFranchise(selectedFranchiseId),
                listarProdutosPorFranchise(selectedFranchiseId)
            ]);
            setPedidos(pedidosData || []);
            setCustomers(customersData || []);
            setProducts(productsData || []);
        } catch (error) {
            console.error("Erro ao carregar dados da página:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedFranchiseId]);

    useEffect(() => {
        if (!authLoading && permissions.canView) {
            fetchPageData();
        }
    }, [authLoading, permissions.canView, fetchPageData]);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !permissions.canView)) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, authLoading, permissions.canView, router]);

    const handleViewDetails = async (pedidoId: number) => {
        try {
            const { order, items } = await buscarPedidoPorId(pedidoId);
            if (order) {
                setViewOrder({ order, items });
            }
        } catch (error) {
            console.error("Erro ao buscar detalhes do pedido:", error);
            // TODO: Adicionar toast de erro
        }
    };

    const handleCreateOrder = async (data: OrderFormData) => {
        if (!selectedFranchiseId) return;
        try {
            // Validação robusta dos itens do pedido
            const itemsData = data.items
                .filter(item => Number(item.product_id) > 0 && Number(item.quantity) > 0)
                .map(item => ({
                    product_id: Number(item.product_id),
                    quantity: Number(item.quantity),
                    price_per_unit: Number(item.price_per_unit),
                }));

            if (itemsData.length === 0) {
                alert("Erro: O pedido deve conter pelo menos um item válido."); // Substituir por toast
                return;
            }

            const orderData = {
                company_id: Number(data.company_id),
                franchise_id: selectedFranchiseId,
                user_id: user?.id || null,
                status: 'pendente' as const,
                total_amount: data.total_amount,
                notes: data.notes || null,
                shipping_cost: data.shipping_cost || 0,
            };

            await criarPedido(orderData, itemsData);
            setNewOrderDialogOpen(false);
            await fetchPageData();
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            alert(`Erro ao criar pedido: ${error instanceof Error ? error.message : 'Erro desconhecido'}`); // Substituir por toast
        }
    };

    const stats = useMemo(() => {
        const totalRevenue = pedidos.reduce((acc, order) => acc + order.total_amount, 0);
        return {
            total: pedidos.length,
            pending: pedidos.filter(p => p.status === 'pendente').length,
            totalRevenue: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        };
    }, [pedidos]);

    const filteredPedidos = pedidos.filter(pedido =>
        pedido.crm_companies?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.id.toString().includes(searchTerm)
    );

    const getStatusVariant = (status: Order['status']) => {
        switch (status) {
            case 'concluído': return 'default';
            case 'cancelado': return 'destructive';
            default: return 'secondary';
        }
    };

    if (authLoading || !permissions.canView) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold">Gestão de Pedidos</h1>
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
                <StatCard title="Receita Total" value={stats.totalRevenue} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Total de Pedidos" value={stats.total} icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Pedidos Pendentes" value={stats.pending} icon={<Clock className="h-4 w-4 text-muted-foreground" />} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Lista de Pedidos</CardTitle>
                            <CardDescription>Visualize e gerencie os pedidos da empresa selecionada.</CardDescription>
                        </div>
                        {permissions.canEdit && (
                            <Button onClick={() => setNewOrderDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Pedido
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por cliente ou ID do pedido..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pedido ID</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Valor Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center h-24">Carregando pedidos...</TableCell></TableRow>
                            ) : filteredPedidos.length > 0 ? (
                                filteredPedidos.map(pedido => (
                                    <TableRow key={pedido.id}>
                                        <TableCell className="font-mono">#{pedido.id}</TableCell>
                                        <TableCell>{new Date(pedido.created).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{pedido.crm_companies?.name || 'Cliente não encontrado'}</TableCell>
                                        <TableCell>R$ {pedido.total_amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(pedido.status)}
                                                className={pedido.status === 'concluído' ? 'bg-green-600 text-white' : ''}>
                                                {pedido.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(pedido.id)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">Nenhum pedido encontrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog para VER DETALHES */}
            <Dialog open={!!viewOrder} onOpenChange={(isOpen) => !isOpen && setViewOrder(null)}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Pedido</DialogTitle>
                    </DialogHeader>
                    {viewOrder && <OrderForm mode="view" order={viewOrder} customers={[]} products={[]} userId={user?.id || null} />}
                </DialogContent>
            </Dialog>

            {/* Dialog para CRIAR NOVO PEDIDO */}
            <Dialog open={newOrderDialogOpen} onOpenChange={setNewOrderDialogOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Novo Pedido</DialogTitle>
                    </DialogHeader>
                    <OrderForm
                        mode="create"
                        customers={customers}
                        products={products}
                        userId={user?.id || null}
                        onSubmit={handleCreateOrder}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
