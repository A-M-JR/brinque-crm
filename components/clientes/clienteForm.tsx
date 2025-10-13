"use client";

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
import { Plus } from "lucide-react";

import { Company } from "@/lib/supabase/companies";
import {
    Subscription,
    SubscriptionPlan,
    listarAssinaturasPorCliente,
    listarPlanosPorFranchise,
    criarAssinatura,
} from "@/lib/supabase/subscriptions";

// Tipagem do formulário do cliente
export type ClienteFormData = Omit<Company, "id" | "created" | "franchise_id">;

type ClienteFormProps = {
    cliente: Company; // Recebe o cliente completo, incluindo o ID
    onSubmit: (data: ClienteFormData) => void | Promise<void>;
    loading?: boolean;
};

// Helpers
const formatCentsToBRL = (cents: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((cents || 0) / 100);

// Formulário de Nova Assinatura (dentro do Dialog)
const NovaAssinaturaForm = ({
    planos,
    onSave,
    onCancel,
}: {
    planos: SubscriptionPlan[];
    onSave: (data: { subscription_plan_id: number; plan_name: string; amount_cents: number }) => void;
    onCancel: () => void;
}) => {
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [valorUS, setValorUS] = useState<string>(""); // padrão americano 1234.56

    const handlePlanChange = (planId: string) => {
        setSelectedPlanId(planId);
        const plan = planos.find((p) => String(p.id) === planId);
        if (plan) {
            const preco = Number(plan.default_price ?? 0); // esperado em reais
            setValorUS(Number.isFinite(preco) ? preco.toFixed(2) : "");
        } else {
            setValorUS("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const plan = planos.find((p) => String(p.id) === selectedPlanId);
        if (!plan) return;

        const amount = Number((valorUS || "").replace(/[^0-9.]/g, "")) || 0;
        const amount_cents = Math.round(amount * 100);

        onSave({
            subscription_plan_id: Number(plan.id),
            plan_name: String(plan.name),
            amount_cents,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
                <Label htmlFor="plano">Plano de Assinatura</Label>
                <Select onValueChange={handlePlanChange} value={selectedPlanId || "all"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Selecione...</SelectItem>
                        {planos.map((plan) => (
                            <SelectItem key={plan.id} value={String(plan.id)}>
                                {plan.name} {plan.billing_cycle ? `(${plan.billing_cycle})` : ""}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="valor">Valor (formato 1234.56)</Label>
                <Input
                    id="valor"
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex.: 99.90"
                    value={valorUS}
                    onChange={(e) => setValorUS(e.target.value)}
                    required
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Digite com ponto como separador decimal. O valor será salvo em centavos (BRL).
                </p>
            </div>

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={!selectedPlanId || selectedPlanId === "all"}>
                    Adicionar Assinatura
                </Button>
            </DialogFooter>
        </form>
    );
};

// Componente Principal
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
                listarAssinaturasPorCliente(cliente.id), // company_id
                listarPlanosPorFranchise(cliente.franchise_id),
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

    const handleNovaAssinatura = async (data: {
        subscription_plan_id: number;
        plan_name: string;
        amount_cents: number;
    }) => {
        try {
            await criarAssinatura({
                franchise_id: cliente.franchise_id,
                user_id: null, // se houver vínculo a usuário, ajuste aqui
                company_id: cliente.id, // vínculo com cliente/empresa

                subscription_plan_id: data.subscription_plan_id,
                plan_name: data.plan_name,
                amount_cents: data.amount_cents,
                currency: "BRL",

                status: "authorized", // status inicial
                mp_preapproval_id: null,
                raw: null,
            });

            setDialogOpen(false);
            await fetchAssinaturasEPlanos();
        } catch (error) {
            console.error("Erro ao criar nova assinatura:", error);
        }
    };

    const getStatusVariant = (status?: string | null) => {
        switch (status) {
            case "authorized":
                return "default";
            case "cancelled":
                return "destructive";
            case "paused":
            case "expired":
            case "finished":
            default:
                return "secondary";
        }
    };

    const renderStatusPtBr = (status?: string | null) => {
        switch (status) {
            case "authorized":
                return "Autorizada";
            case "paused":
                return "Pausada";
            case "cancelled":
                return "Cancelada";
            case "expired":
                return "Expirada";
            case "finished":
                return "Finalizada";
            default:
                return "-";
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

                {/* Aba Cadastro */}
                <TabsContent value="cadastro">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Cliente</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                <select
                                                    {...field}
                                                    value={field.value ? "true" : "false"}
                                                    onChange={(e) => field.onChange(e.target.value === "true")}
                                                    className="w-full mt-1 block border rounded-md px-3 py-2 bg-white"
                                                    disabled={loading}
                                                >
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

                {/* Aba Assinaturas */}
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
                                        <TableHead>Criada em</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assinaturas.length > 0 ? (
                                        assinaturas.map((sub) => (
                                            <TableRow key={sub.id}>
                                                <TableCell>
                                                    {sub.plan_name || (sub as any).crm_subscription_plans?.name || "Plano não encontrado"}
                                                </TableCell>
                                                <TableCell>{formatCentsToBRL(sub.amount_cents)}</TableCell>
                                                <TableCell>
                                                    {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(sub.status)}>{renderStatusPtBr(sub.status)}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">
                                                Nenhuma assinatura encontrada.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Aba Pagamentos */}
                <TabsContent value="pagamentos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Pagamentos</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center p-8">
                            <p>O histórico de pagamentos será implementado aqui.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialog de Nova Assinatura */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Assinatura</DialogTitle>
                        <DialogDescription>Selecione um plano e confirme o valor para o cliente.</DialogDescription>
                    </DialogHeader>
                    <NovaAssinaturaForm
                        planos={planos}
                        onSave={handleNovaAssinatura}
                        onCancel={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}