"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { ProductForm, ProductFormData } from '@/components/produtos/productForm';
import { Product, buscarProdutoPorId, atualizarProduto } from '@/lib/supabase/products';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';

export default function EditProdutoPage() {
    const router = useRouter();
    const params = useParams();
    const produtoId = parseInt(params.id as string, 10);
    const { group, franchise } = useAuth();

    const [produto, setProduto] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const canEdit = useMemo(() => {
        const groupPermissions = group?.permissions ?? {};
        const franchiseModules = franchise?.modules_enabled ?? [];
        return hasPermission('produtos', 'edit', groupPermissions, franchiseModules);
    }, [group, franchise]);

    const fetchData = useCallback(async () => {
        if (isNaN(produtoId)) {
            router.push('/produtos');
            return;
        }
        setLoading(true);
        try {
            const productData = await buscarProdutoPorId(produtoId);
            if (productData) {
                setProduto(productData);
            } else {
                router.push('/produtos');
            }
        } catch (error) {
            console.error("Erro ao buscar dados do produto:", error);
        } finally {
            setLoading(false);
        }
    }, [produtoId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (data: ProductFormData) => {
        if (!canEdit) return;
        setSaving(true);
        try {
            const productDataToSave: ProductFormData = {
                name: data.name,
                sku: data.sku,
                description: data.description,
                price: data.price,
                old_price: data.old_price,
                is_new: data.is_new,
                status: data.status,
                show_on_store: data.show_on_store,
                images: data.images,
                custom_fields: data.custom_fields,
            };

            await atualizarProduto(produtoId, productDataToSave);
            router.push('/produtos');
        } catch (error: any) {
            console.error("Erro ao salvar produto:", error.message || error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    if (!produto) {
        return (
            <div className="flex flex-col h-screen items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
                <Link href="/produtos">
                    <Button><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-4">
                <Link href="/produtos">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editando Produto</h1>
                    <p className="text-muted-foreground">{produto?.name}</p>
                </div>
            </div>

            <ProductForm
                initialData={produto}
                onSubmit={handleSave}
                loading={saving}
            />
        </div>
    );
}