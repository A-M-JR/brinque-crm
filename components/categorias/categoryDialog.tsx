"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryForm, CategoryFormData } from "./categoryForm";
import { Category } from "@/lib/supabase/categories";

type CategoryDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CategoryFormData) => void;
    initialData?: Category | null;
    loading?: boolean;
};

export function CategoryDialog({ isOpen, onClose, onSave, initialData, loading }: CategoryDialogProps) {
    const isEditing = !!initialData;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Altere os dados da categoria." : "Preencha os dados para criar uma nova categoria."}
                    </DialogDescription>
                </DialogHeader>
                
                <CategoryForm
                    onSubmit={onSave}
                    initialData={initialData || { name: '', description: '', status: true }}
                    loading={loading}
                />

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button type="submit" form="category-form" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}