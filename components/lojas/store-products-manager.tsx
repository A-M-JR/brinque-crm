"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '@/lib/supabase/products';
import { StoreItem, getStoreItems, addStoreItem, removeStoreItem } from '@/lib/supabase/stores';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle, Search, PackageOpen } from 'lucide-react';
import Image from 'next/image';

type StoreProductsManagerProps = {
    storeId: number;
    availableProducts: Product[];
};

const ProductListItem = ({ product, onAction, actionType }: { product: Product, onAction: () => void, actionType: 'add' | 'remove' }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
        <div className="flex items-center gap-3">
            <Image 
                src={product.images?.[0]?.url || '/placeholder.png'} 
                alt={product.name} 
                width={40} 
                height={40} 
                className="rounded-sm object-cover"
            />
            <div>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
            </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onAction}>
            {actionType === 'add' ? <PlusCircle className="h-5 w-5 text-green-600" /> : <MinusCircle className="h-5 w-5 text-red-600" />}
        </Button>
    </div>
);

export function StoreProductsManager({ storeId, availableProducts }: StoreProductsManagerProps) {
    const [showcaseItems, setShowcaseItems] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const items = await getStoreItems(storeId);
                setShowcaseItems(items);
            } catch (error) {
                console.error("Erro ao buscar itens da vitrine:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [storeId]);

    const handleAddItem = async (productId: number) => {
        const productToAdd = availableProducts.find(p => p.id === productId);
        if (!productToAdd) return;

        const newItem: StoreItem = { id: Date.now(), store_id: storeId, product_id: productId, product: productToAdd };
        setShowcaseItems(prev => [...prev, newItem]);

        try {
            await addStoreItem(storeId, productId);
        } catch (error) {
            setShowcaseItems(prev => prev.filter(item => item.product_id !== productId));
            console.error("Falha ao adicionar item:", error);
        }
    };

    const handleRemoveItem = async (productId: number) => {
        setShowcaseItems(prev => prev.filter(item => item.product_id !== productId));
        try {
            await removeStoreItem(storeId, productId);
        } catch (error) {
            console.error("Falha ao remover item:", error);
        }
    };

    const showcaseProductIds = useMemo(() => new Set(showcaseItems.map(item => item.product_id)), [showcaseItems]);

    const filteredAvailableProducts = availableProducts
        .filter(p => !showcaseProductIds.has(p.id))
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Produtos Disponíveis</CardTitle>
                    <CardDescription>Adicione produtos do seu catálogo à vitrine.</CardDescription>
                    <div className="relative pt-2">
                        <Search className="absolute left-2 top-4 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar produto..." 
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto space-y-1">
                    {filteredAvailableProducts.length > 0 ? (
                        filteredAvailableProducts.map(product => (
                            <ProductListItem 
                                key={product.id} 
                                product={product} 
                                onAction={() => handleAddItem(product.id)} 
                                actionType="add" 
                            />
                        ))
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-10">
                            <PackageOpen className="mx-auto h-10 w-10 mb-2" />
                            Nenhum produto disponível para adicionar.
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Produtos na Vitrine</CardTitle>
                    <CardDescription>Estes produtos estão visíveis na sua loja.</CardDescription>
                {/* 👇 CORREÇÃO AQUI 👇 */}
                </CardHeader>
                <CardContent className="max-h-[552px] overflow-y-auto space-y-1">
                    {loading ? <p>Carregando...</p> : showcaseItems.length > 0 ? (
                        showcaseItems.map(item => (
                            <ProductListItem 
                                key={item.product_id} 
                                product={item.product} 
                                onAction={() => handleRemoveItem(item.product_id)} 
                                actionType="remove" 
                            />
                        ))
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-10">
                            <PackageOpen className="mx-auto h-10 w-10 mb-2" />
                            Sua vitrine está vazia. Adicione produtos da lista ao lado.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}