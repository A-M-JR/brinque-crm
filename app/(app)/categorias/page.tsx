"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Componentes UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageFeedback } from "@/components/ui/page-loader";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// Lógica de Categoria
import { Category, listarCategoriasPorFranchise, criarCategoria, atualizarCategoria, deletarCategoria } from '@/lib/supabase/categories';
import { CategoryDialog } from '@/components/categorias/categoryDialog';
import { CategoryFormData } from '@/components/categorias/categoryForm';

export default function CategoriasPage() {
    const { franchise, loading: authLoading } = useAuth();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!franchise?.id) return;
        setLoading(true);
        try {
            const data = await listarCategoriasPorFranchise(franchise.id);
            setCategories(data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            // TODO: Adicionar toast de erro
        } finally {
            setLoading(false);
        }
    }, [franchise?.id]);

    useEffect(() => {
        if (!authLoading) {
            fetchCategories();
        }
    }, [authLoading, fetchCategories]);

    const handleOpenDialog = (category: Category | null = null) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedCategory(null);
    };

    const handleSave = async (data: CategoryFormData) => {
        if (!franchise?.id) return;
        setSaving(true);
        try {
            if (selectedCategory?.id) {
                // Editando
                await atualizarCategoria(selectedCategory.id, data);
            } else {
                // Criando
                await criarCategoria({ ...data, franchise_id: franchise.id });
            }
            // TODO: Adicionar toast de sucesso
            fetchCategories(); // Re-fetch para atualizar a lista
            handleCloseDialog();
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
            // TODO: Adicionar toast de erro
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setIsAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;
        setSaving(true);
        try {
            await deletarCategoria(categoryToDelete.id);
            // TODO: Adicionar toast de sucesso
            fetchCategories(); // Re-fetch
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
            // TODO: Adicionar toast de erro
        } finally {
            setSaving(false);
            setIsAlertOpen(false);
            setCategoryToDelete(null);
        }
    };

    if (authLoading || loading) {
        return <PageFeedback mode='both' />;
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Categorias de Produtos</CardTitle>
                            <CardDescription>Gerencie as categorias para organizar seus produtos.</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Categoria
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length > 0 ? (
                                categories.map(category => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.description || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={category.status ? 'default' : 'secondary'}>
                                                {category.status ? 'Ativa' : 'Inativa'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(category)} className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Deletar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">Nenhuma categoria encontrada.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog para Criar/Editar */}
            <CategoryDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                initialData={selectedCategory}
                loading={saving}
            />

            {/* Alert para Deletar */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso irá deletar permanentemente a categoria "{categoryToDelete?.name}". Os produtos associados a ela não serão deletados, mas ficarão sem categoria.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} disabled={saving}>
                            {saving ? "Deletando..." : "Confirmar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}