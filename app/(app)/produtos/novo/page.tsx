"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { ProductForm, ProductFormData } from '@/components/produtos/productForm';
import { criarProduto } from '@/lib/supabase/products';
import { Category, listarCategoriasPorFranchise } from '@/lib/supabase/categories';
import { uploadProductImage } from '@/lib/supabase/storage';
import { useAuth } from '@/hooks/use-auth';

export default function NovoProdutoPage() {
    const router = useRouter();
    const { franchise } = useAuth();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchPrerequisites = useCallback(async () => {
        if (!franchise?.id) return;
        setLoading(true);
        try {
            const categoriesData = await listarCategoriasPorFranchise(franchise.id);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        } finally {
            setLoading(false);
        }
    }, [franchise?.id]);

    useEffect(() => {
        fetchPrerequisites();
    }, [fetchPrerequisites]);

    const handleSave = async (data: ProductFormData) => {
        if (!franchise?.id) return;
        setSaving(true);
        try {
            const uploadPromises = data.new_images.map(file => 
                uploadProductImage(file, franchise.id)
            );
            const newImageUrls = await Promise.all(uploadPromises);
            const finalImageUrls = newImageUrls.map(url => ({ url }));

            const { new_images, existing_images, ...productData } = data;

            const productDataToSave = {
                ...productData,
                franchise_id: franchise.id,
                images: finalImageUrls,
            };

            await criarProduto(productDataToSave);
            
            router.push('/produtos');
        } catch (error: any) {
            console.error("Erro ao criar produto:", error.message || error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
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
                    <h1 className="text-3xl font-bold">Novo Produto</h1>
                    <p className="text-muted-foreground">Preencha os dados para cadastrar um item</p>
                </div>
            </div>

            <ProductForm
                initialData={{
                    name: '',
                    price: 0,
                    status: true,
                    show_on_store: true,
                    is_new: true,
                }}
                onSubmit={handleSave}
                loading={saving}
                categories={categories}
            />
        </div>
    );
}