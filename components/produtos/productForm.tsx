"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Product } from "@/lib/supabase/products";

// --- Tipagens ---
export type ProductFormData = Omit<Product, 'id' | 'created' | 'franchise_id' | 'inventory'>;

type ProductFormProps = {
    initialData: Partial<ProductFormData>;
    onSubmit: (data: ProductFormData) => void | Promise<void>;
    loading?: boolean;
};

export function ProductForm({ initialData, onSubmit, loading = false }: ProductFormProps) {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProductFormData>({
        defaultValues: initialData
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Dados do Produto</CardTitle>
                    <CardDescription>Informações principais que serão exibidas para os clientes e para a gestão interna.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nome do Produto</Label>
                            <Input id="name" {...register("name", { required: "O nome é obrigatório" })} disabled={loading} />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="sku">SKU (Código)</Label>
                            <Input id="sku" {...register("sku")} disabled={loading} />
                        </div>
                        <div>
                            <Label htmlFor="price">Preço (R$)</Label>
                            <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true, required: "O preço é obrigatório" })} disabled={loading} />
                            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" {...register("description")} disabled={loading} />
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <Controller name="status" control={control} render={({ field }) => <Switch id="status" checked={field.value} onCheckedChange={field.onChange} disabled={loading} />} />
                            <Label htmlFor="status">Produto Ativo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Controller name="show_on_store" control={control} render={({ field }) => <Switch id="show_on_store" checked={field.value} onCheckedChange={field.onChange} disabled={loading} />} />
                            <Label htmlFor="show_on_store">Mostrar na Loja Online</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-end mt-6">
                <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </div>
        </form>
    );
}
