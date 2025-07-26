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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, UserPlus, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';
import { Lead, listarLeadsPorFranchise, atualizarStatusLead, criarLead } from '@/lib/supabase/leads';
import { LeadForm, LeadFormData } from '@/components/leads/leadForm'; // Importa o formulário unificado

export default function LeadsPage() {
  const router = useRouter();
  const { group, franchise, isAuthenticated, loading: authLoading } = useAuth();

  const permissions = useMemo(() => {
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const moduleKey = 'leads';

    return {
      canView: hasPermission(moduleKey, 'view', groupPermissions, franchiseModules),
      canEdit: hasPermission(moduleKey, 'edit', groupPermissions, franchiseModules),
    }
  }, [group, franchise]);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentStatus, setCurrentStatus] = useState<Lead['status'] | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [newLeadDialogOpen, setNewLeadDialogOpen] = useState(false);

  const fetchLeads = useCallback(async () => {
    if (!franchise?.id) return;
    setLoading(true);
    try {
      const data = await listarLeadsPorFranchise(franchise.id);
      setLeads(data || []);
    } catch (error) {
      console.error("Erro ao carregar leads:", error);
    } finally {
      setLoading(false);
    }
  }, [franchise?.id]);

  useEffect(() => {
    if (!authLoading && permissions.canView) {
      fetchLeads();
    }
  }, [authLoading, permissions.canView, fetchLeads]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !permissions.canView)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, permissions.canView, router]);

  useEffect(() => {
    if (selectedLead) {
      setCurrentStatus(selectedLead.status);
    }
  }, [selectedLead]);

  const handleSaveStatus = async () => {
    if (!permissions.canEdit || !selectedLead || !currentStatus) return;

    setIsSaving(true);
    try {
      await atualizarStatusLead(selectedLead.id, currentStatus);
      await fetchLeads();
      setSelectedLead(null);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateManualLead = async (data: LeadFormData) => {
    if (!franchise?.id) return;
    setIsSaving(true);
    try {
      // CORRIGIDO: Converte 'undefined' para 'null' para alinhar com a tipagem do Supabase
      const leadDataToSave = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        cpf: data.cpf || null,
        city: data.city || null,
        state: data.state || null,
        franchise_id: franchise.id,
        status: 'novo' as const, // Garante o tipo literal
        form_data: { origem: 'manual' }
      };

      await criarLead(leadDataToSave);
      setNewLeadDialogOpen(false);
      await fetchLeads();
      // TODO: Adicionar toast de sucesso
    } catch (error) {
      console.error("Erro ao criar lead manual:", error);
      // TODO: Adicionar toast de erro
    } finally {
      setIsSaving(false);
    }
  };

  const handleConvertToReseller = (lead: Lead) => {
    const query = new URLSearchParams({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
    }).toString();
    router.push(`/usuarios?${query}`);
  };

  const getStatusVariant = (status: Lead['status']) => {
    switch (status) {
      case 'novo': return 'default';
      case 'contatado': return 'secondary';
      case 'convertido': return 'default';
      case 'perdido': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || !permissions.canView) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads Recebidos</h1>
        {permissions.canEdit && (
          <Button onClick={() => setNewLeadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24">Carregando leads...</TableCell></TableRow>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map(lead => (
                  <TableRow key={lead.id}>
                    <TableCell>{new Date(lead.created).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(lead.status)}
                        className={lead.status === 'convertido' ? 'bg-green-600 text-white' : ''}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedLead(lead)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Nenhum lead encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para VER DETALHES do lead */}
      <Dialog open={!!selectedLead} onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Visualize as informações do lead e gerencie o status e ações.
            </DialogDescription>
          </DialogHeader>

          {selectedLead && <LeadForm mode="view" lead={selectedLead} />}

          <DialogFooter className="pt-4 sm:justify-between">
            {selectedLead && permissions.canEdit && (
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleConvertToReseller(selectedLead)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Converter para Revendedor
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Select value={currentStatus} onValueChange={(value) => setCurrentStatus(value as Lead['status'])}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="contatado">Contatado</SelectItem>
                  <SelectItem value="convertido">Convertido</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSaveStatus} disabled={isSaving || currentStatus === selectedLead?.status}>
                {isSaving ? "Salvando..." : "Salvar Status"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para CRIAR NOVO lead manual */}
      <Dialog open={newLeadDialogOpen} onOpenChange={setNewLeadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo lead.
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            mode="create"
            onSubmit={handleCreateManualLead}
            onCancel={() => setNewLeadDialogOpen(false)}
            loading={isSaving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
