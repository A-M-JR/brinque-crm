"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // CORRIGIDO: Importação do Badge adicionada
import { Plus, Edit, Trash2, Search, Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { GrupoPermissao, listarGruposPermissao, criarGrupoPermissao, deletarGrupoPermissao } from '@/lib/supabase/permissoes';
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

export default function PermissionsGroupPage() {
  const router = useRouter();
  const { group: userGroup, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = userGroup?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const moduleKey = 'usuarios';

    return {
      canView: hasPermission(moduleKey, 'view', groupPermissions, franchiseModules),
      canEdit: hasPermission(moduleKey, 'edit', groupPermissions, franchiseModules),
      canDelete: hasPermission(moduleKey, 'delete', groupPermissions, franchiseModules),
    }
  }, [userGroup, franchise]);

  const [groups, setGroups] = useState<GrupoPermissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    if (franchise?.id) {
      setSelectedFranchiseId(franchise.id);
      if (franchise.id === 1) {
        listarFranchisesVisiveis(franchise.id).then(setFranchises);
      }
    }
  }, [franchise?.id]);

  const fetchGroups = useCallback(async () => {
    if (!selectedFranchiseId) return;
    setLoading(true);
    try {
      // TODO: Garanta que sua função `listarGruposPermissao` pode filtrar por franchise_id
      const data = await listarGruposPermissao(selectedFranchiseId);
      setGroups(data || []);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFranchiseId]);

  useEffect(() => {
    if (!authLoading && permissions.canView) {
      fetchGroups();
    }
  }, [authLoading, permissions.canView, fetchGroups]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !permissions.canView)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, permissions.canView, router]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await criarGrupoPermissao({
        name: newGroupName,
        permissions: {},
        status: true,
        franchise_id: selectedFranchiseId ?? franchise?.id
      });
      setDialogOpen(false);
      await fetchGroups();
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  const handleEdit = (groupId: number) => {
    router.push(`/permissoes/${groupId}`);
  };

  const handleDelete = async (groupId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo de permissão?')) {
      await deletarGrupoPermissao(groupId);
      await fetchGroups();
    }
  };

  const stats = useMemo(() => ({
    total: groups.length,
    active: groups.filter(g => g.status).length,
    inactive: groups.filter(g => !g.status).length,
  }), [groups]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || !permissions.canView) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Grupos de Permissão</h1>
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
        <StatCard title="Total de Grupos" value={stats.total} icon={<Shield className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Grupos Ativos" value={stats.active} icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Grupos Inativos" value={stats.inactive} icon={<ShieldX className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Grupos</CardTitle>
              <CardDescription>Gerencie os grupos e suas permissões de acesso.</CardDescription>
            </div>
            {permissions.canEdit && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Grupo
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar grupos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Grupo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center h-24">Carregando...</TableCell></TableRow>
              ) : filteredGroups.length > 0 ? (
                filteredGroups.map(group => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>
                      <Badge variant={group.status ? 'default' : 'secondary'}>
                        {group.status ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {permissions.canEdit && (
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(group.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {permissions.canDelete && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(group.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">Nenhum grupo encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Grupo de Permissão</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGroup}>
            <div className="py-4">
              <Label htmlFor="group-name">Nome do Grupo</Label>
              <Input id="group-name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Ex: Vendedor" required className="mt-2" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Criar Grupo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
