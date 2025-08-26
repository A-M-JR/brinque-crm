"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { StoreForm, StoreFormData } from '@/components/lojas/store-form';
import { salvarLoja } from '@/lib/supabase/stores';
import { Franchise, listarFranchisesVisiveis } from '@/lib/supabase/franchises';
import { PageFeedback } from '@/components/ui/page-loader';

export default function NovaLojaPage() {
    const router = useRouter();
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                const data = await listarFranchisesVisiveis(1); // Assumindo que o admin (ID 1) pode ver todas
                setFranchises(data);
            } catch (error) {
                console.error("Erro ao buscar franquias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFranchises();
    }, []);

    const handleSave = async (data: StoreFormData) => {
        setSaving(true);
        try {
            // Converte franchise_id para número antes de salvar
            const dataToSave = {
                ...data,
                franchise_id: Number(data.franchise_id),
            };
            await salvarLoja(dataToSave);
            router.push('/lojas');
        } catch (error) {
            console.error("Erro ao criar loja:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <PageFeedback  />;
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-4">
                <Link href="/lojas">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nova Loja</h1>
                    <p className="text-muted-foreground">Preencha os dados para cadastrar uma nova loja.</p>
                </div>
            </div>
            <StoreForm
                onSubmit={handleSave}
                franchises={franchises}
                loading={saving}
            />
        </div>
    );
}