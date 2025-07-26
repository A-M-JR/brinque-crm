"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Users, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { useUsuarios } from "@/hooks/use-usuarios";
import { UsuarioForm, UsuarioFormData } from "@/components/usuarios/usuarioForm";
import { criarUsuario, atualizarUsuario, excluirUsuario } from "@/lib/supabase/usuarios";
import { listarGruposPermissao } from "@/lib/supabase/permissoes";
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

export default function UsuariosPage() {
  const router = useRouter();
  const { group, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const moduleKey = 'usuarios';

    return {
      canView: hasPermission(moduleKey, 'view', groupPermissions, franchiseModules),
      canEdit: hasPermission(moduleKey, 'edit', groupPermissions, franchiseModules),
      canDelete: hasPermission(moduleKey, 'delete', groupPermissions, franchiseModules),
    }
  }, [group, franchise]);

  const [searchTerm, setSearchTerm] = useState('');
  const [grupos, setGrupos] = useState<{ id: number; name: string }[]>([]);

  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<UsuarioFormData | undefined>();

  const { usuarios, loading: loadingUsuarios, refetch } = useUsuarios(selectedFranchiseId);

  // Define a empresa selecionada inicial e carrega a lista de empresas para o admin
  useEffect(() => {
    if (franchise?.id) {
      setSelectedFranchiseId(franchise.id);
      if (franchise.id === 1) {
        listarFranchisesVisiveis(franchise.id).then(setFranchises);
      }
    }
  }, [franchise?.id]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !permissions.canView)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, permissions.canView, router]);

  // Carrega grupos de permissão da empresa selecionada
  useEffect(() => {
    if (selectedFranchiseId) {
      listarGruposPermissao(selectedFranchiseId)
        .then(data => setGrupos(data.map(g => ({ id: g.id, name: g.name }))))
        .catch(err => console.error("Erro ao carregar grupos:", err));
    }
  }, [selectedFranchiseId]); // Depende da empresa selecionada

  const handleNovo = () => {
    setEditData(undefined);
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleEditar = (usuario: any) => {
    setEditData({
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      type: usuario.type,
      password: "",
      id_status: usuario.id_status,
      group_id: usuario.group_id ?? null,
      franchise_id: usuario.franchise_id
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleRemover = async (id: number) => {
    if (confirm("Deseja realmente remover este usuário?")) {
      await excluirUsuario(id);
      await refetch();
    }
  };

  const stats = useMemo(() => ({
    total: usuarios.length,
    active: usuarios.filter(u => u.id_status === 1).length,
    inactive: usuarios.filter(u => u.id_status !== 1).length,
  }), [usuarios]);

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || !permissions.canView) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
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
        <StatCard title="Total de Usuários" value={stats.total} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Usuários Ativos" value={stats.active} icon={<UserCheck className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Usuários Inativos" value={stats.inactive} icon={<UserX className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>Gerencie os usuários do sistema.</CardDescription>
            </div>
            {permissions.canEdit && (
              <Button onClick={handleNovo}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingUsuarios ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Carregando...</TableCell></TableRow>
              ) : filteredUsuarios.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhum usuário encontrado.</TableCell></TableRow>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.name}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant={usuario.type === "admin_master" ? "default" : "secondary"}>{usuario.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={usuario.id_status === 1 ? "default" : "secondary"}>{usuario.id_status === 1 ? "ativo" : "inativo"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {permissions.canEdit && (
                          <Button variant="ghost" size="icon" onClick={() => handleEditar(usuario)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {permissions.canDelete && (
                          <Button variant="ghost" size="icon" onClick={() => handleRemover(usuario.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogDescription>Preencha os dados para {editMode ? "editar" : "adicionar"} um usuário.</DialogDescription>
          </DialogHeader>
          <UsuarioForm
            gruposPermissao={grupos}
            editMode={editMode}
            initialData={editData}
            onSubmit={async (data: UsuarioFormData) => {
              try {
                if (editMode) {
                  await atualizarUsuario(data);
                } else {
                  const { id, ...dadosSemId } = data;
                  await criarUsuario({
                    ...dadosSemId,
                    franchise_id: selectedFranchiseId ?? franchise?.id
                  });
                }
                await refetch();
                setDialogOpen(false);
              } catch (err) {
                console.error("Erro ao salvar usuário:", err);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
