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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Building, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { Franchise, listarFranchisesVisiveis, criarFranchise, deletarFranchise } from '@/lib/supabase/franchises';

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

export default function EmpresasPage() {
  const router = useRouter();
  const { group, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const moduleKey = 'empresas';

    return {
      canView: hasPermission(moduleKey, 'view', groupPermissions, franchiseModules),
      canEdit: hasPermission(moduleKey, 'edit', groupPermissions, franchiseModules),
      canDelete: hasPermission(moduleKey, 'delete', groupPermissions, franchiseModules),
    }
  }, [group, franchise]);

  const [empresas, setEmpresas] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmpresaName, setNewEmpresaName] = useState('');

  const fetchEmpresas = useCallback(async () => {
    if (!franchise?.id) return;
    setLoading(true);
    try {
      const data = await listarFranchisesVisiveis(franchise.id);
      setEmpresas(data || []);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    } finally {
      setLoading(false);
    }
  }, [franchise?.id]);

  useEffect(() => {
    if (!authLoading && permissions.canView) {
      fetchEmpresas();
    }
  }, [authLoading, permissions.canView, fetchEmpresas]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !permissions.canView)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, permissions.canView, router]);

  const handleCreateAndEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpresaName.trim()) return;
    try {
      const novaEmpresa = await criarFranchise({
        name: newEmpresaName,
        status: true,
        id_franchise_responsible: franchise?.id === 1 ? undefined : franchise?.id
      } as any);

      setDialogOpen(false);

      if (novaEmpresa && novaEmpresa.id) {
        router.push(`/empresas/${novaEmpresa.id}`);
      } else {
        await fetchEmpresas();
      }
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
    }
  };

  const handleEdit = (empresaId: number) => {
    router.push(`/empresas/${empresaId}`);
  };

  const handleDelete = async (empresaId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      await deletarFranchise(empresaId);
      await fetchEmpresas();
    }
  };

  const stats = useMemo(() => ({
    total: empresas.length,
    active: empresas.filter(e => e.status).length,
    inactive: empresas.filter(e => !e.status).length,
  }), [empresas]);

  const filteredEmpresas = useMemo(() => {
    return empresas
      .filter(e => {
        if (filter === 'active') return e.status;
        if (filter === 'inactive') return !e.status;
        return true;
      })
      .filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.cnpj && e.cnpj.includes(searchTerm))
      );
  }, [empresas, searchTerm, filter]);

  if (authLoading || !permissions.canView) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Empresas</h1>
        {permissions.canEdit && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Empresa
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total de Empresas" value={stats.total} icon={<Building className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Empresas Ativas" value={stats.active} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Empresas Inativas" value={stats.inactive} icon={<XCircle className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>Visualize e gerencie as empresas do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou CNPJ..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>Todas</Button>
              <Button variant={filter === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('active')}>Ativas</Button>
              <Button variant={filter === 'inactive' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('inactive')}>Inativas</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Carregando...</TableCell></TableRow>
              ) : filteredEmpresas.length > 0 ? (
                filteredEmpresas.map(empresa => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">{empresa.name}</TableCell>
                    <TableCell>{empresa.cnpj || 'N/A'}</TableCell>
                    <TableCell>{empresa.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={empresa.status ? 'default' : 'secondary'}>
                        {empresa.status ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {permissions.canEdit && (
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(empresa.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {permissions.canDelete && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(empresa.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Nenhuma empresa encontrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Empresa</DialogTitle>
            <DialogDescription>Digite o nome da nova empresa para iniciar o cadastro.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAndEdit} className="pt-4">
            <div>
              <Label htmlFor="new-empresa-name">Nome da Empresa</Label>
              <Input id="new-empresa-name" value={newEmpresaName} onChange={(e) => setNewEmpresaName(e.target.value)} required />
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
