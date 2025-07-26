"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { FranchiseForm, FranchiseFormData } from '@/components/empresas/franchiseForm';
import { buscarFranchisePorId, atualizarFranchise } from '@/lib/supabase/franchises';
import { Franchise } from '@/lib/supabase/franchises';
import { listarModulos } from '@/lib/supabase/modules';

// A tipagem para os módulos que o formulário espera
type ModuleDefinition = {
    key: string;
    name: string;
};

export default function EditEmpresaPage() {
    const router = useRouter();
    const params = useParams(); // Hook para obter os parâmetros da URL no cliente
    const franchiseId = parseInt(params.id as string, 10);

    const [franchise, setFranchise] = useState<Franchise | null>(null);
    const [allModules, setAllModules] = useState<ModuleDefinition[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (isNaN(franchiseId)) {
            router.push('/empresas');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const [data, modulesData] = await Promise.all([
                buscarFranchisePorId(franchiseId),
                listarModulos()
            ]);

            if (data) {
                setFranchise(data);
            } else {
                setError("Empresa não encontrada.");
                return;
            }

            const mappedModules = modulesData.map(module => ({
                key: module.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                name: module.name
            }));
            setAllModules(mappedModules);

        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError("Falha ao carregar os dados da empresa.");
        } finally {
            setLoading(false);
        }
    }, [franchiseId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (data: FranchiseFormData) => {
        setSaving(true);
        try {
            // Converte o objeto de booleans do formulário de volta para um array de strings
            const modulesEnabledArray = Object.keys(data.modules_enabled || {})
                .filter(key => (data.modules_enabled as Record<string, boolean>)[key] === true);

            // CORRIGIDO: Monta um novo objeto apenas com os dados do formulário para evitar misturar dados antigos.
            const dataToSave = {
                name: data.name,
                cnpj: data.cnpj,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                state: data.state,
                zipcode: data.zipcode,
                status: data.status,
                modules_enabled: modulesEnabledArray, // Usa o array de módulos corrigido
            };

            await atualizarFranchise(franchiseId, dataToSave);
            // TODO: Adicionar toast de sucesso
            router.push('/empresas');
        } catch (error) {
            console.error("Erro ao salvar empresa:", error);
            // TODO: Adicionar toast de erro
        } finally {
            setSaving(false);
        }
    };

    // Prepara os dados iniciais para o formulário, convertendo o array em objeto
    const getInitialFormData = () => {
        if (!franchise) return {};

        const modulesEnabledObject = (franchise.modules_enabled as unknown as string[] || []).reduce((acc, moduleKey) => {
            acc[moduleKey] = true;
            return acc;
        }, {} as Record<string, boolean>);

        return {
            ...franchise,
            modules_enabled: modulesEnabledObject
        };
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold mb-2">Ocorreu um Erro</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Link href="/empresas">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para a lista de empresas
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-4">
                <Link href="/empresas">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editando Empresa</h1>
                    <p className="text-muted-foreground">{franchise?.name}</p>
                </div>
            </div>
            <FranchiseForm
                initialData={getInitialFormData() as FranchiseFormData}
                allModules={allModules}
                onSubmit={handleSave}
                loading={saving}
            />
        </div>
    );
}
