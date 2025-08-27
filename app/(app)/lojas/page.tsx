"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Store, listarLojas, deletarLoja } from '@/lib/supabase/stores';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function LojasPage() {
    const router = useRouter();
    const [lojas, setLojas] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [lojaParaDeletar, setLojaParaDeletar] = useState<Store | null>(null);

    const fetchLojas = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listarLojas();
            setLojas(data);
        } catch (error) {
            console.error("Erro ao carregar lojas:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLojas();
    }, [fetchLojas]);

    const handleDelete = async () => {
        if (!lojaParaDeletar) return;
        try {
            await deletarLoja(lojaParaDeletar.id);
            setLojaParaDeletar(null);
            fetchLojas(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao deletar loja:", error);
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Gerenciamento de Lojas</CardTitle>
                            <CardDescription>Cadastre e gerencie as lojas virtuais da plataforma.</CardDescription>
                        </div>
                        <Button onClick={() => router.push('/lojas/nova')}>
                            <Plus className="mr-2 h-4 w-4" />Nova Loja
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome da Loja</TableHead>
                                <TableHead>Franquia Vinculada</TableHead>
                                <TableHead>URL (Slug)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[120px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24">Carregando lojas...</TableCell></TableRow>
                            ) : lojas.length > 0 ? (
                                lojas.map(loja => (
                                    <TableRow key={loja.id}>
                                        <TableCell className="font-medium">{loja.name}</TableCell>
                                        <TableCell>{loja.franchise?.name || 'N/A'}</TableCell>
                                        <TableCell>/{loja.slug}</TableCell>
                                        <TableCell>
                                            <Badge variant={loja.is_active ? 'default' : 'secondary'}>
                                                {loja.is_active ? 'Ativa' : 'Inativa'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/lojas/${loja.id}`} passHref>
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" onClick={() => setLojaParaDeletar(loja)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhuma loja encontrada.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal de Confirmação para Deletar */}
            <AlertDialog open={!!lojaParaDeletar} onOpenChange={() => setLojaParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso irá deletar permanentemente a loja
                            <span className="font-bold"> {lojaParaDeletar?.name}</span> e todos os seus dados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}