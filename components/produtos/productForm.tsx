"use client"

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/lib/supabase/products";
import { Category } from "@/lib/supabase/categories";
import { Trash2, UploadCloud } from "lucide-react";

export type ProductFormData = Omit<Product, 'id' | 'created' | 'franchise_id' | 'inventory' | 'images' | 'category'> & {
    existing_images: { url: string }[];
    new_images: File[];
};

type ProductFormProps = {
    initialData: Partial<Product>;
    onSubmit: (data: ProductFormData) => void | Promise<void>;
    loading?: boolean;
    categories: Category[];
};

export function ProductForm({ initialData, onSubmit, loading = false, categories = [] }: ProductFormProps) {
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
        defaultValues: {
            ...initialData,
            existing_images: Array.isArray(initialData.images) ? initialData.images : [],
            new_images: [],
        }
    });

    const existingImages = watch('existing_images');
    const newImages = watch('new_images');

    useEffect(() => {
        reset({
            ...initialData,
            existing_images: Array.isArray(initialData.images) ? initialData.images : [],
            new_images: [],
        });
    }, [initialData, reset]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setValue('new_images', [...newImages, ...files]);
        }
    };

    const removeExistingImage = (index: number) => {
        setValue('existing_images', existingImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setValue('new_images', newImages.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dados do Produto</CardTitle>
                    <CardDescription>Informações principais, preços e categoria.</CardDescription>
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
                        <div>
                            <Label htmlFor="category_id">Categoria</Label>
                            <Controller
                                name="category_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value?.toString()}
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        disabled={loading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
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
                    <CardDescription>Adicione, visualize e remova as imagens do produto.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 min-h-[8rem]">
                        {existingImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <Image src={image.url} alt={`Imagem ${index + 1}`} width={150} height={150} className="rounded-md object-cover w-full h-32" />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeExistingImage(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {newImages.map((file, index) => (
                            <div key={index} className="relative group">
                                <Image src={URL.createObjectURL(file)} alt={file.name} width={150} height={150} className="rounded-md object-cover w-full h-32" />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeNewImage(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste</p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                        </div>
                        <Input id="image-upload" type="file" multiple className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                    </Label>
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