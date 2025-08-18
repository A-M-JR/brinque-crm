"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { documentMask } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Users, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { Company, listarCompaniesPorFranchise, criarCompany, deletarCompany } from '@/lib/supabase/companies';
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

export default function ClientesPage() {
  const router = useRouter();
  const { group, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const moduleKey = 'clientes';

    return {
      canView: hasPermission(moduleKey, 'view', groupPermissions, franchiseModules),
      canEdit: hasPermission(moduleKey, 'edit', groupPermissions, franchiseModules),
      canDelete: hasPermission(moduleKey, 'delete', groupPermissions, franchiseModules),
    }
  }, [group, franchise]);

  const [clientes, setClientes] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newClienteData, setNewClienteData] = useState<Partial<Omit<Company, 'id' | 'created'>>>({});

  useEffect(() => {
    if (franchise?.id) {
      setSelectedFranchiseId(franchise.id);
      if (franchise.id === 1) { // Super admin
        listarFranchisesVisiveis(franchise.id).then(setFranchises);
      }
    }
  }, [franchise?.id]);

  const fetchClientes = useCallback(async () => {
    if (!selectedFranchiseId) return;
    setLoading(true);
    try {
      const data = await listarCompaniesPorFranchise(selectedFranchiseId);
      setClientes(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFranchiseId]);

  useEffect(() => {
    if (!authLoading && permissions.canView) {
      fetchClientes();
    }
  }, [authLoading, permissions.canView, fetchClientes]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !permissions.canView)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, permissions.canView, router]);

  const handleCreateAndEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClienteData.name?.trim() || !selectedFranchiseId) return;
    try {
      const novoCliente = await criarCompany({
        ...newClienteData,
        name: newClienteData.name,
        status: true,
        franchise_id: selectedFranchiseId
      } as any);

      setDialogOpen(false);

      if (novoCliente && novoCliente.id) {
        router.push(`/clientes/${novoCliente.id}`);
      } else {
        await fetchClientes();
      }
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  };

  const handleEdit = (clienteId: number) => {
    router.push(`/clientes/${clienteId}`);
  };

  const handleDelete = async (clienteId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await deletarCompany(clienteId);
      await fetchClientes();
    }
  };

  const stats = useMemo(() => ({
    total: clientes.length,
    active: clientes.filter(c => c.status).length,
    inactive: clientes.filter(c => !c.status).length,
  }), [clientes]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.cpf_cnpj && cliente.cpf_cnpj.includes(searchTerm))
  );

  if (authLoading || !permissions.canView) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
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
        <StatCard title="Total de Clientes" value={stats.total} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Clientes Ativos" value={stats.active} icon={<UserCheck className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Clientes Inativos" value={stats.inactive} icon={<UserX className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Visualize e gerencie os clientes da empresa selecionada.</CardDescription>
            </div>
            {permissions.canEdit && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou CPF/CNPJ..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Carregando clientes...</TableCell></TableRow>
              ) : filteredClientes.length > 0 ? (
                filteredClientes.map(cliente => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.name}</TableCell>
                    <TableCell>{cliente.email || 'N/A'}</TableCell>
                    <TableCell>{cliente.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={cliente.status ? 'default' : 'secondary'}>
                        {cliente.status ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {permissions.canEdit && (<Button variant="ghost" size="icon" onClick={() => handleEdit(cliente.id)}><Edit className="h-4 w-4" /></Button>)}
                        {permissions.canDelete && (<Button variant="ghost" size="icon" onClick={() => handleDelete(cliente.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhum cliente encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Preencha os dados iniciais do cliente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAndEdit} className="pt-4 space-y-4">
            <div>
              <Label htmlFor="name">Nome do Cliente *</Label>
              <Input id="name" value={newClienteData.name || ''} onChange={(e) => setNewClienteData(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={newClienteData.email || ''} onChange={(e) => setNewClienteData(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={newClienteData.phone || ''} onChange={(e) => setNewClienteData(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="cpf_cnpj">CPF / CNPJ</Label>
              <Input maxLength={17} id="cpf_cnpj" value={documentMask(newClienteData.cpf_cnpj || '')} onChange={(e) => setNewClienteData(p => ({ ...p, cpf_cnpj: e.target.value }))} />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Criar e Editar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
