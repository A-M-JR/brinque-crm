"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Franchise } from "@/lib/supabase/franchises";

// --- Tipagens ---
export type FranchiseFormData = Omit<Franchise, 'id' | 'created_at' | 'created_by' | 'modified_at' | 'modified_by'> & {
    id?: number;
};

type ModuleDefinition = {
    key: string;
    name: string;
};

type FranchiseFormProps = {
    initialData?: Partial<FranchiseFormData>;
    allModules: ModuleDefinition[];
    onSubmit: (data: FranchiseFormData) => void | Promise<void>;
    loading?: boolean;
};

export function FranchiseForm({ initialData = {}, allModules, onSubmit, loading = false }: FranchiseFormProps) {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FranchiseFormData>({
        defaultValues: {
            ...initialData,
            modules_enabled: initialData?.modules_enabled || {} // Garante que seja um objeto
        },
    });

    useEffect(() => {
        reset({
            ...initialData,
            modules_enabled: initialData?.modules_enabled || {}
        });
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Dados Cadastrais</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Label htmlFor="name">Nome da Empresa</Label>
                        <Input id="name" {...register("name", { required: "Nome é obrigatório" })} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" {...register("cnpj")} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                    </div>
                    <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" {...register("phone")} />
                    </div>
                    <div>
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" {...register("address")} />
                    </div>
                    <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" {...register("city")} />
                    </div>
                    <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" {...register("state")} />
                    </div>
                    <div>
                        <Label htmlFor="zipcode">CEP</Label>
                        <Input id="zipcode" {...register("zipcode")} />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            defaultValue={true}
                            render={({ field }) => (
                                <select
                                    id="status"
                                    value={field.value ? 'true' : 'false'}
                                    onChange={(e) => field.onChange(e.target.value === 'true')}
                                    className="w-full mt-1 block border rounded-md px-3 py-2"
                                >
                                    <option value="true">Ativa</option>
                                    <option value="false">Inativa</option>
                                </select>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Módulos Habilitados</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allModules.map(module => (
                        <div key={module.key} className="flex items-center space-x-2">
                            <Controller
                                name={`modules_enabled.${module.key}`}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                    <Checkbox
                                        id={module.key}
                                        checked={!!field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor={module.key} className="font-medium">{module.name}</Label>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </div>
        </form>
    );
}
