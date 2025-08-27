"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/lib/supabase/categories";

// Tipagem para os dados do formulário
export type CategoryFormData = Omit<Category, 'id' | 'created_at' | 'franchise_id'>;

type CategoryFormProps = {
    initialData?: Partial<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => void;
    loading?: boolean;
};

export function CategoryForm({ initialData, onSubmit, loading = false }: CategoryFormProps) {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CategoryFormData>({
        defaultValues: initialData || { name: '', description: '', status: true }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                    id="name"
                    {...register("name", { required: "O nome é obrigatório" })}
                    disabled={loading}
                    placeholder="Ex: Eletrônicos"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    disabled={loading}
                    placeholder="Uma breve descrição da categoria (opcional)"
                />
            </div>
            <div className="flex items-center space-x-2 pt-2">
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            id="status"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                        />
                    )}
                />
                <Label htmlFor="status">Categoria Ativa</Label>
            </div>
        </form>
    );
}