"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { Company, listarCompaniesPorFranchise, criarCompany, deletarCompany } from '@/lib/supabase/companies';

// --- Tipagem para o formulário de novo cliente ---
type NewClienteFormData = {
  name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
};

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newClienteData, setNewClienteData] = useState<Partial<NewClienteFormData>>({});

  const fetchClientes = useCallback(async () => {
    if (!franchise?.id) return;
    setLoading(true);
    try {
      const data = await listarCompaniesPorFranchise(franchise.id);
      setClientes(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  }, [franchise?.id]);

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

  const handleAddNew = () => {
    setNewClienteData({}); // Limpa os dados do formulário anterior
    setDialogOpen(true);
  };

  const handleCreateAndEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClienteData.name?.trim() || !franchise?.id) return;
    try {
      const novoCliente = await criarCompany({
        name: newClienteData.name,
        email: newClienteData.email || null,
        phone: newClienteData.phone || null,
        cpf_cnpj: newClienteData.cpf_cnpj || null,
        status: true,
        franchise_id: franchise.id
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
      try {
        await deletarCompany(clienteId);
        await fetchClientes();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.cpf_cnpj && cliente.cpf_cnpj.includes(searchTerm))
  );

  if (authLoading || !permissions.canView) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
        {permissions.canEdit && (
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Clientes</CardTitle></CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CPF/CNPJ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8"
            />
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
                        {permissions.canEdit && (
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(cliente.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {permissions.canDelete && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(cliente.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Nenhum cliente encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados iniciais do cliente para iniciar o cadastro.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAndEdit} className="pt-4 space-y-4">
            <div>
              <Label htmlFor="new-cliente-name">Nome do Cliente *</Label>
              <Input id="new-cliente-name" value={newClienteData.name || ''} onChange={(e) => setNewClienteData(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="new-cliente-email">Email</Label>
              <Input id="new-cliente-email" type="email" value={newClienteData.email || ''} onChange={(e) => setNewClienteData(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="new-cliente-phone">Telefone</Label>
              <Input id="new-cliente-phone" value={newClienteData.phone || ''} onChange={(e) => setNewClienteData(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="new-cliente-cpf">CPF / CNPJ</Label>
              <Input id="new-cliente-cpf" value={newClienteData.cpf_cnpj || ''} onChange={(e) => setNewClienteData(p => ({ ...p, cpf_cnpj: e.target.value }))} />
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
