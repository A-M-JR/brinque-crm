"use client"

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from 'lucide-react';
import { Company } from "@/lib/supabase/companies";
import { Subscription, SubscriptionPlan, listarAssinaturasPorCliente, listarPlanosPorFranchise, criarAssinatura } from "@/lib/supabase/subscriptions";

// --- Tipagens ---
export type ClienteFormData = Omit<Company, 'id' | 'created' | 'franchise_id'>;

type ClienteFormProps = {
    cliente: Company; // Recebe o cliente completo, incluindo o ID
    onSubmit: (data: ClienteFormData) => void | Promise<void>;
    loading?: boolean;
};

// --- Componente do Formulário de Nova Assinatura ---
const NovaAssinaturaForm = ({ planos, onSave, onCancel }: { planos: SubscriptionPlan[], onSave: (data: any) => void, onCancel: () => void }) => {
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const [valor, setValor] = useState<number>(0);

    const handlePlanChange = (planId: string) => {
        const plan = planos.find(p => p.id.toString() === planId);
        if (plan) {
            setSelectedPlanId(planId);
            setValor(plan.default_price);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ plan_id: parseInt(selectedPlanId, 10), value: valor });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
                <Label htmlFor="plano">Plano de Assinatura</Label>
                <Select onValueChange={handlePlanChange} value={selectedPlanId}>
                    <SelectTrigger><SelectValue placeholder="Selecione um plano..." /></SelectTrigger>
                    <SelectContent>
                        {planos.map(plan => (
                            <SelectItem key={plan.id} value={plan.id.toString()}>{plan.name} ({plan.billing_cycle})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input id="valor" type="number" step="0.01" value={valor} onChange={e => setValor(parseFloat(e.target.value))} required />
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Adicionar Assinatura</Button>
            </DialogFooter>
        </form>
    );
};


// --- Componente Principal do Formulário do Cliente ---
export function ClienteForm({ cliente, onSubmit, loading = false }: ClienteFormProps) {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ClienteFormData>({
        defaultValues: cliente,
    });

    const [assinaturas, setAssinaturas] = useState<Subscription[]>([]);
    const [planos, setPlanos] = useState<SubscriptionPlan[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchAssinaturasEPlanos = useCallback(async () => {
        try {
            const [assinaturasData, planosData] = await Promise.all([
                listarAssinaturasPorCliente(cliente.id),
                listarPlanosPorFranchise(cliente.franchise_id)
            ]);
            setAssinaturas(assinaturasData || []);
            setPlanos(planosData || []);
        } catch (error) {
            console.error("Erro ao buscar assinaturas e planos:", error);
        }
    }, [cliente.id, cliente.franchise_id]);

    useEffect(() => {
        fetchAssinaturasEPlanos();
    }, [fetchAssinaturasEPlanos]);

    useEffect(() => {
        reset(cliente);
    }, [cliente, reset]);

    const handleNovaAssinatura = async (data: { plan_id: number, value: number }) => {
        try {
            await criarAssinatura({
                customer_id: cliente.id,
                plan_id: data.plan_id,
                value: data.value,
                status: 'ativa',
                start_date: new Date().toISOString().split('T')[0],
                end_date: null,
                next_billing_date: null,
                metadata: {}
            });
            setDialogOpen(false);
            await fetchAssinaturasEPlanos();
        } catch (error) {
            console.error("Erro ao criar nova assinatura:", error);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ativa': return 'default';
            case 'cancelada': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <>
            <Tabs defaultValue="cadastro" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cadastro">Dados Cadastrais</TabsTrigger>
                    <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
                    <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
                </TabsList>

                <TabsContent value="cadastro">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader><CardTitle>Informações do Cliente</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* CAMPOS RESTAURADOS */}
                                    <div>
                                        <Label htmlFor="name">Nome / Razão Social</Label>
                                        <Input id="name" {...register("name", { required: "O nome é obrigatório" })} disabled={loading} />
                                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="cpf_cnpj">CPF / CNPJ</Label>
                                        <Input id="cpf_cnpj" {...register("cpf_cnpj")} disabled={loading} />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" {...register("email")} disabled={loading} />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Telefone</Label>
                                        <Input id="phone" {...register("phone")} disabled={loading} />
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Endereço</Label>
                                        <Input id="address" {...register("address")} disabled={loading} />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">Cidade</Label>
                                        <Input id="city" {...register("city")} disabled={loading} />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">Estado (UF)</Label>
                                        <Input id="state" {...register("state")} disabled={loading} />
                                    </div>
                                    <div>
                                        <Label htmlFor="zipcode">CEP</Label>
                                        <Input id="zipcode" {...register("zipcode")} disabled={loading} />
                                    </div>
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <select {...field} value={field.value ? 'true' : 'false'} onChange={(e) => field.onChange(e.target.value === 'true')} className="w-full mt-1 block border rounded-md px-3 py-2 bg-white" disabled={loading}>
                                                    <option value="true">Ativo</option>
                                                    <option value="false">Inativo</option>
                                                </select>
                                            )}
                                        />
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
                </TabsContent>

                <TabsContent value="assinaturas">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Assinaturas do Cliente</CardTitle>
                            <Button onClick={() => setDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Assinatura
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Plano</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Data de Início</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assinaturas.length > 0 ? assinaturas.map((sub) => (
                                        <TableRow key={sub.id}>
                                            <TableCell>{(sub as any).crm_subscription_plans?.name || 'Plano não encontrado'}</TableCell>
                                            <TableCell>R$ {sub.value.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(sub.start_date).toLocaleDateString()}</TableCell>
                                            <TableCell><Badge variant={getStatusVariant(sub.status)}>{sub.status}</Badge></TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={4} className="text-center h-24">Nenhuma assinatura encontrada.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pagamentos">
                    <Card>
                        <CardHeader><CardTitle>Histórico de Pagamentos</CardTitle></CardHeader>
                        <CardContent className="text-center p-8">
                            <p>O histórico de pagamentos será implementado aqui.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Assinatura</DialogTitle>
                        <DialogDescription>Selecione um plano e confirme o valor para o cliente.</DialogDescription>
                    </DialogHeader>
                    <NovaAssinaturaForm planos={planos} onSave={handleNovaAssinatura} onCancel={() => setDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}
