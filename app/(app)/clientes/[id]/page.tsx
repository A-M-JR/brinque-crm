"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { ClienteForm, ClienteFormData } from '@/components/clientes/clienteForm';
import { buscarCompanyPorId, atualizarCompany } from '@/lib/supabase/companies';
import { Company } from '@/lib/supabase/companies';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';

export default function EditClientePage() {
    const router = useRouter();
    const params = useParams();
    const clienteId = parseInt(params.id as string, 10);
    const { group, franchise } = useAuth();

    const [cliente, setCliente] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Verifica se o utilizador tem permissão para editar
    const canEdit = useMemo(() => {
        const groupPermissions = group?.permissions ?? {};
        const franchiseModules = franchise?.modules_enabled ?? [];
        return hasPermission('clientes', 'edit', groupPermissions, franchiseModules);
    }, [group, franchise]);

    const fetchData = useCallback(async () => {
        if (isNaN(clienteId)) {
            router.push('/clientes');
            return;
        }
        setLoading(true);
        try {
            const data = await buscarCompanyPorId(clienteId);
            if (data) {
                setCliente(data);
            } else {
                // TODO: Adicionar toast de erro
                router.push('/clientes');
            }
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
        } finally {
            setLoading(false);
        }
    }, [clienteId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (data: ClienteFormData) => {
        if (!canEdit) {
            // TODO: Adicionar toast de "sem permissão"
            return;
        }
        setSaving(true);
        try {
            await atualizarCompany(clienteId, data);
            // TODO: Adicionar toast de sucesso
            router.push('/clientes');
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
            // TODO: Adicionar toast de erro
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    if (!cliente) {
        return (
            <div className="flex flex-col h-screen items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold mb-2">Cliente não encontrado</h2>
                <p className="text-muted-foreground mb-4">O cliente que você está a tentar editar não existe.</p>
                <Link href="/clientes">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para a lista de clientes
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-4">
                <Link href="/clientes">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editando Cliente</h1>
                    <p className="text-muted-foreground">{cliente?.name}</p>
                </div>
            </div>

            <ClienteForm
                cliente={cliente} 
                onSubmit={handleSave}
                loading={saving}
            />
        </div>
    );
}
