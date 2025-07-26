"use client"

import { useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Permissao } from "@/lib/supabase/permissoes" // Importa a tipagem completa

// --- Tipagens ---

// A PermissionDefinition agora usa a tipagem completa da Permissao
export type PermissionDefinition = Permissao & {
    module_key: string;
};

export type PermissionFormData = {
    [module_key: string]: {
        can_view: boolean;
        can_edit: boolean;
        can_delete: boolean;
    };
};

type PermissaoFormProps = {
    initialData?: PermissionFormData;
    allPermissions: PermissionDefinition[];
    onSubmit: (data: PermissionFormData) => void | Promise<void>;
    loading?: boolean;
};


export function PermissaoForm({
    initialData = {},
    allPermissions,
    onSubmit,
    loading = false
}: PermissaoFormProps) {

    const { handleSubmit, control, watch, setValue, reset } = useForm<PermissionFormData>({
        defaultValues: initialData,
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    // Agrupa dinamicamente as permissões por categoria
    const groupedPermissions = useMemo(() => {
        return allPermissions.reduce((acc, permission) => {
            // Usa a categoria vinda do banco de dados, com um fallback para "Outras"
            const category = permission.crm_modules?.category || 'Outras';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
        }, {} as Record<string, PermissionDefinition[]>);
    }, [allPermissions]);

    const handleSelectAllModuleActions = (moduleKey: string, isChecked: boolean) => {
        setValue(`${moduleKey}.can_view`, isChecked);
        setValue(`${moduleKey}.can_edit`, isChecked);
        setValue(`${moduleKey}.can_delete`, isChecked);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([category, permissionsInCategory]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle>{category}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {permissionsInCategory.map((permission) => {
                                const moduleKey = permission.module_key;
                                const watchedModule = watch(moduleKey);
                                const areAllSelected = watchedModule?.can_view && watchedModule?.can_edit && watchedModule?.can_delete;

                                return (
                                    <div key={permission.id} className="p-4 border rounded-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold">{permission.name}</h4>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`select-all-${moduleKey}`}
                                                    checked={!!areAllSelected}
                                                    onCheckedChange={(checked) => handleSelectAllModuleActions(moduleKey, !!checked)}
                                                />
                                                <Label htmlFor={`select-all-${moduleKey}`} className="text-sm font-medium">Todos</Label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Controller name={`${moduleKey}.can_view`} control={control} defaultValue={false} render={({ field }) => (<Checkbox id={`${moduleKey}-view`} checked={field.value} onCheckedChange={field.onChange} />)} />
                                                <Label htmlFor={`${moduleKey}-view`}>Visualizar</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Controller name={`${moduleKey}.can_edit`} control={control} defaultValue={false} render={({ field }) => (<Checkbox id={`${moduleKey}-edit`} checked={field.value} onCheckedChange={field.onChange} />)} />
                                                <Label htmlFor={`${moduleKey}-edit`}>Editar</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Controller name={`${moduleKey}.can_delete`} control={control} defaultValue={false} render={({ field }) => (<Checkbox id={`${moduleKey}-delete`} checked={field.value} onCheckedChange={field.onChange} />)} />
                                                <Label htmlFor={`${moduleKey}-delete`}>Excluir</Label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Permissões"}
                </Button>
            </div>
        </form>
    );
}
