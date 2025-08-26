"use client"

import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Product } from "@/lib/supabase/products";
import { Trash2, PlusCircle } from "lucide-react";

// --- Tipagens ---
// Garantindo que os novos campos estão incluídos
export type ProductFormData = Omit<Product, 'id' | 'created' | 'franchise_id' | 'inventory'> & {
    images: { url: string }[] | null; // Tipagem mais específica para o formulário
};

type ProductFormProps = {
    initialData: Partial<ProductFormData>;
    onSubmit: (data: ProductFormData) => void | Promise<void>;
    loading?: boolean;
};

export function ProductForm({ initialData, onSubmit, loading = false }: ProductFormProps) {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProductFormData>({
        defaultValues: {
            ...initialData,
            images: Array.isArray(initialData.images) ? initialData.images : [] // Garante que images seja um array
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "images"
    });

    useEffect(() => {
        reset({
            ...initialData,
            images: Array.isArray(initialData.images) ? initialData.images : []
        });
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        <div>
                            <Label htmlFor="old_price">Preço Antigo (R$)</Label>
                            <Input id="old_price" type="number" step="0.01" {...register("old_price", { valueAsNumber: true })} placeholder="Ex: 99.90" disabled={loading} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" {...register("description")} disabled={loading} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <Controller name="status" control={control} render={({ field }) => <Switch id="status" checked={field.value} onCheckedChange={field.onChange} disabled={loading} />} />
                            <Label htmlFor="status">Produto Ativo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Controller name="show_on_store" control={control} render={({ field }) => <Switch id="show_on_store" checked={field.value} onCheckedChange={field.onChange} disabled={loading} />} />
                            <Label htmlFor="show_on_store">Mostrar na Loja</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Controller name="is_new" control={control} render={({ field }) => <Switch id="is_new" checked={field.value} onCheckedChange={field.onChange} disabled={loading} />} />
                            <Label htmlFor="is_new">Marcar como Novidade</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Imagens do Produto</CardTitle>
                    <CardDescription>Adicione as URLs das imagens. A primeira imagem será a principal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <Input
                                placeholder="https://exemplo.com/imagem.png"
                                {...register(`images.${index}.url`, { required: "URL é obrigatória" })}
                                disabled={loading}
                            />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={loading}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ url: '' })}
                        disabled={loading}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Imagem
                    </Button>
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