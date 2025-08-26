"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { ProductForm, ProductFormData } from '@/components/produtos/productForm';
import { Product, buscarProdutoPorId, atualizarProduto } from '@/lib/supabase/products';
import { Category, listarCategoriasPorFranchise } from '@/lib/supabase/categories';
import { uploadProductImage } from '@/lib/supabase/storage';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth/hasPermission';

export default function EditProdutoPage() {
    const router = useRouter();
    const params = useParams();
    const produtoId = parseInt(params.id as string, 10);
    const { group, franchise } = useAuth();

    const [produto, setProduto] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const canEdit = useMemo(() => {
        const groupPermissions = group?.permissions ?? {};
        const franchiseModules = franchise?.modules_enabled ?? [];
        return hasPermission('produtos', 'edit', groupPermissions, franchiseModules);
    }, [group, franchise]);

    const fetchData = useCallback(async () => {
        // A verificação interna ainda é uma boa prática, mas a chamada agora é controlada pelo useEffect
        if (isNaN(produtoId) || !franchise?.id) {
            return;
        }
        setLoading(true);
        try {
            const [productData, categoriesData] = await Promise.all([
                buscarProdutoPorId(produtoId),
                listarCategoriasPorFranchise(franchise.id)
            ]);
            
            if (productData) {
                setProduto(productData);
                setCategories(categoriesData);
            } else {
                // Se o produto não for encontrado (ex: ID inválido na URL), aí sim redirecionamos
                router.push('/produtos');
            }
        } catch (error) {
            console.error("Erro ao buscar dados do produto e categorias:", error);
        } finally {
            setLoading(false);
        }
    }, [produtoId, router, franchise?.id]);

    // 👇 AQUI ESTÁ A CORREÇÃO PRINCIPAL 👇
    // O useEffect agora espera ativamente por franchise.id e um produtoId válido antes de chamar fetchData.
    useEffect(() => {
        if (franchise?.id && !isNaN(produtoId)) {
            fetchData();
        }
    }, [franchise?.id, produtoId, fetchData]);

    const handleSave = async (data: ProductFormData) => {
        if (!canEdit || !franchise?.id) return;
        setSaving(true);
        try {
            const uploadPromises = data.new_images.map(file => 
                uploadProductImage(file, franchise.id)
            );
            const newImageUrls = await Promise.all(uploadPromises);

            const finalImageUrls = [
                ...data.existing_images,
                ...newImageUrls.map(url => ({ url }))
            ];

            const { new_images, existing_images, ...productData } = data;

            const productDataToSave = {
                ...productData,
                images: finalImageUrls,
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
        // Este estado pode ser mostrado brevemente antes do redirect se o produto não existir
        return (
            <div className="flex flex-col h-screen items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
                <p className="text-muted-foreground mb-4">Redirecionando para a lista...</p>
                <Link href="/produtos"><Button><ArrowLeft className="mr-2 h-4 w-4" />Voltar para a lista</Button></Link>
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
                categories={categories}
            />
        </div>
    );
}