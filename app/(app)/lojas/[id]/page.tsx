"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreForm, StoreFormData } from '@/components/lojas/store-form';
// 👇 CORREÇÃO 1: O caminho agora usa "lojas" (plural)
import { Store, buscarLojaPorId, salvarLoja } from '@/lib/supabase/stores';
import { Franchise, listarFranchisesVisiveis } from '@/lib/supabase/franchises';
import { Product, listarProdutosPorFranchise } from '@/lib/supabase/products';
import { PageFeedback } from '@/components/ui/page-loader';
import { StoreProductsManager } from '@/components/lojas/store-products-manager';

export default function EditLojaPage() {
    const router = useRouter();
    const params = useParams();
    const storeId = parseInt(params.id as string, 10);

    const [store, setStore] = useState<Store | null>(null);
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        if (isNaN(storeId)) return;
        setLoading(true);
        try {
            const [storeData, franchisesData] = await Promise.all([
                buscarLojaPorId(storeId),
                listarFranchisesVisiveis(1) // Assumindo admin
            ]);

            if (storeData) {
                setStore(storeData);
                setFranchises(franchisesData);
                const productsData = await listarProdutosPorFranchise(storeData.franchise_id);
                setAvailableProducts(productsData.filter(p => p.status && p.show_on_store));
            } else {
                router.push('/lojas');
            }
        } catch (error) {
            console.error("Erro ao buscar dados da loja:", error);
        } finally {
            setLoading(false);
        }
    }, [storeId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (data: StoreFormData) => {
        setSaving(true);
        try {
            await salvarLoja(data, storeId);
            fetchData(); 
            router.push('/lojas')
        } catch (error) {
            console.error("Erro ao atualizar loja:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        // 👇 CORREÇÃO 2: Trocado "loading" por "spinner"
        return <PageFeedback mode="spinner" />;
    }

    if (!store) {
        // 👇 CORREÇÃO 3: Trocado "error" por "both"
        return <PageFeedback mode="both" message="Loja não encontrada." />;
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-4">
                <Link href="/lojas">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editando Loja</h1>
                    <p className="text-muted-foreground">{store.name}</p>
                </div>
            </div>

            <Tabs defaultValue="settings">
                <TabsList>
                    <TabsTrigger value="settings">Configurações</TabsTrigger>
                    <TabsTrigger value="products">Produtos da Vitrine</TabsTrigger>
                </TabsList>
                <TabsContent value="settings" className="mt-6">
                    <StoreForm
                        initialData={store}
                        onSubmit={handleSave}
                        franchises={franchises}
                        loading={saving}
                    />
                </TabsContent>
                <TabsContent value="products" className="mt-6">
                    <StoreProductsManager 
                        storeId={store.id}
                        availableProducts={availableProducts}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}