"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// --- Imports ---
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { PermissaoForm, PermissionFormData, PermissionDefinition } from '@/components/permissoes/permissaoForm';
import { buscarGrupoPermissao, listarPermissoes, editarGrupoPermissao } from '@/lib/supabase/permissoes';
import { GrupoPermissao } from '@/lib/supabase/permissoes';

// --- Componente da Página de Edição ---
export default function EditPermissionGroupPage() {
    const router = useRouter();
    const params = useParams();
    const groupId = parseInt(params.id as string, 10);

    const [group, setGroup] = useState<GrupoPermissao | null>(null);
    const [allPermissions, setAllPermissions] = useState<PermissionDefinition[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Carregar dados ---
    const fetchData = useCallback(async () => {
        if (isNaN(groupId)) {
            router.push('/permissoes');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const [groupData, permissionsData] = await Promise.all([
                buscarGrupoPermissao(groupId),
                listarPermissoes() // Esta função agora traz a categoria do módulo
            ]);

            if (groupData) {
                setGroup(groupData);
            } else {
                setError("Grupo de permissão não encontrado.");
                return;
            }

            // Mapeia os dados para o formato que o formulário dinâmico espera
            const mappedPermissions = permissionsData.map(p => {
                // A chave do módulo é gerada a partir do nome do módulo relacionado
                const module_key = p.crm_modules?.name.trim().toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/ /g, '_') || '';

                return {
                    ...p, // Passa o objeto de permissão completo, incluindo a categoria
                    module_key,
                };
            });
            setAllPermissions(mappedPermissions as PermissionDefinition[]);

        } catch (err: any) {
            console.error("Erro ao carregar dados:", err);
            setError(err.message || "Ocorreu um erro ao carregar os dados.");
        } finally {
            setLoading(false);
        }
    }, [groupId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Função para salvar ---
    const handleSave = async (data: PermissionFormData) => {
        if (!group) return;
        setSaving(true);
        try {
            await editarGrupoPermissao(group.id, { permissions: data as any });
            // TODO: Adicionar toast de sucesso aqui
            router.push('/permissoes');
        } catch (error) {
            console.error("Erro ao salvar permissões:", error);
            // TODO: Adicionar toast de erro aqui
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    if (error || !group) {
        return (
            <div className="flex flex-col h-screen items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold mb-2">Ocorreu um Erro</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Link href="/permissoes">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para a lista de grupos
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-4">
                <Link href="/permissoes">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editando Permissões</h1>
                    <p className="text-muted-foreground">Grupo: {group.name}</p>
                </div>
            </div>

            <PermissaoForm
                allPermissions={allPermissions}
                initialData={group.permissions as unknown as PermissionFormData}
                onSubmit={handleSave}
                loading={saving}
            />
        </div>
    );
}
