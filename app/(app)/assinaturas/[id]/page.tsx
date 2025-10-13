"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth/hasPermission";

import {
    getSubscriptionById,
    upsertSubscription,
    deleteSubscription,
    type Subscription,
} from "@/lib/supabase/subscriptions";
import { supabase } from "@/lib/supabase/client";

type Plan = {
    id: number;
    name: string;
    default_price: number; // numeric -> number
};

type FormState = {
    id?: number;
    user_id: number | null;
    subscription_plan_id: number | null;

    // snapshot
    plan_name: string;
    amount_cents: number; // armazenamos em centavos

    currency: string; // 'BRL'
    status: "authorized" | "paused" | "cancelled" | "expired" | "finished";

    mp_preapproval_id?: string | null;
    raw?: any | null;
};

export default function SubscriptionFormPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const isNew = params.id === "new";
    const recordId = useMemo(() => (isNew ? null : Number(params.id)), [params.id, isNew]);

    const { group, franchise } = useAuth();
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const franchiseId = (franchise?.id as number | undefined) ?? undefined;

    // Permissões: manter 'edit' para criar e editar, conforme seu hasPermission atual
    const canView = hasPermission("assinaturas", "view", groupPermissions, franchiseModules);
    const canEdit = hasPermission("assinaturas", "edit", groupPermissions, franchiseModules);
    const canDelete = hasPermission("assinaturas", "delete", groupPermissions, franchiseModules);

    const [form, setForm] = useState<FormState>({
        user_id: null,
        subscription_plan_id: null,
        plan_name: "",
        amount_cents: 0,
        currency: "BRL",
        status: "authorized",
        mp_preapproval_id: null,
        raw: null,
    });

    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);

    // Carrega planos da franquia para o combobox
    useEffect(() => {
        if (!franchiseId) return;
        (async () => {
            const { data, error } = await supabase
                .from("crm_subscription_plans")
                .select("id, name, default_price")
                .eq("franchise_id", franchiseId)
                .eq("status", true)
                .order("name", { ascending: true });
            if (error) {
                console.error(error);
                return;
            }
            setPlans(
                (data ?? []).map((p) => ({
                    id: Number(p.id),
                    name: String(p.name),
                    default_price: Number(p.default_price ?? 0),
                }))
            );
        })();
    }, [franchiseId]);

    // Carrega registro para edição
    useEffect(() => {
        if (!canView || !recordId) return;
        (async () => {
            setLoading(true);
            try {
                const s = await getSubscriptionById(recordId);
                if (s) {
                    setForm({
                        id: s.id,
                        user_id: (s.user_id as number | null) ?? null,
                        subscription_plan_id: s.subscription_plan_id,
                        plan_name: s.plan_name,
                        amount_cents: s.amount_cents,
                        currency: s.currency ?? "BRL",
                        status: (s.status as FormState["status"]) ?? "authorized",
                        mp_preapproval_id: s.mp_preapproval_id ?? null,
                        raw: s.raw ?? null,
                    });
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [recordId, canView]);

    if (!canView) {
        return (
            <div className="p-6">
                <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Você não tem permissão para visualizar assinaturas.</p>
                </Card>
            </div>
        );
    }

    // Seleção do plano: preenche snapshot a partir do plano
    const onSelectPlan = (planIdStr: string) => {
        const planId = Number(planIdStr);
        const selected = plans.find((p) => p.id === planId);
        setForm((s) => ({
            ...s,
            subscription_plan_id: planId,
            plan_name: selected?.name ?? s.plan_name,
            amount_cents: selected ? Math.round(Number(selected.default_price) * 100) : s.amount_cents,
        }));
    };

    const onSubmit = async () => {
        if (!canEdit || !franchiseId) return;

        // Validações simples
        if (!form.subscription_plan_id) {
            alert("Selecione um plano.");
            return;
        }
        if (!form.plan_name) {
            alert("Informe o nome do plano (snapshot).");
            return;
        }

        setLoading(true);
        try {
            await upsertSubscription({
                id: form.id,
                franchise_id: franchiseId,
                subscription_plan_id: form.subscription_plan_id,
                user_id: form.user_id ?? null,
                plan_name: form.plan_name,
                amount_cents: form.amount_cents,
                currency: form.currency || "BRL",
                mp_preapproval_id: form.mp_preapproval_id ?? null,
                status: form.status,
                raw: form.raw ?? null,
            });
            router.push("/assinaturas");
        } catch (e) {
            console.error(e);
            alert("Erro ao salvar assinatura.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        if (!form.id || !canDelete) return;
        setLoading(true);
        try {
            await deleteSubscription(form.id);
            router.push("/assinaturas");
        } catch (e) {
            console.error(e);
            alert("Erro ao excluir assinatura.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/assinaturas" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-xl font-semibold">{isNew ? "Nova Assinatura" : "Editar Assinatura"}</h1>
                </div>
                {!isNew && canDelete && (
                    <Button variant="destructive" size="sm" onClick={onDelete} disabled={loading}>
                        <Trash className="h-4 w-4 mr-2" />
                        Excluir
                    </Button>
                )}
            </div>

            <Card className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Usuário (ID) — pode virar Combobox depois */}
                    <div>
                        <label className="text-sm">Usuário (ID)</label>
                        <Input
                            value={form.user_id ?? ""}
                            onChange={(e) =>
                                setForm((s) => ({ ...s, user_id: e.target.value ? Number(e.target.value) : null }))
                            }
                            placeholder="ID do usuário (opcional)"
                        />
                    </div>

                    {/* Plano */}
                    <div>
                        <label className="text-sm">Plano</label>
                        <Select
                            value={form.subscription_plan_id ? String(form.subscription_plan_id) : ""}
                            onValueChange={onSelectPlan}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um plano" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Snapshot: nome do plano (editável) */}
                    <div>
                        <label className="text-sm">Nome do plano (snapshot)</label>
                        <Input
                            value={form.plan_name}
                            onChange={(e) => setForm((s) => ({ ...s, plan_name: e.target.value }))}
                            placeholder="Nome congelado do plano"
                        />
                    </div>

                    {/* Snapshot: preço em R$ (conversão para cents) */}
                    <div>
                        <label className="text-sm">Preço (R$)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={(form.amount_cents / 100).toFixed(2)}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    amount_cents: Math.round(Number(e.target.value || 0) * 100),
                                }))
                            }
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-sm">Status</label>
                        <Select
                            value={form.status}
                            onValueChange={(v: FormState["status"]) => setForm((s) => ({ ...s, status: v }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="authorized">Autorizada</SelectItem>
                                <SelectItem value="paused">Pausada</SelectItem>
                                <SelectItem value="cancelled">Cancelada</SelectItem>
                                <SelectItem value="expired">Expirada</SelectItem>
                                <SelectItem value="finished">Finalizada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Moeda */}
                    <div>
                        <label className="text-sm">Moeda</label>
                        <Input
                            value={form.currency}
                            onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value.toUpperCase() }))}
                            placeholder="BRL"
                        />
                    </div>

                    {/* mp_preapproval_id opcional */}
                    <div>
                        <label className="text-sm">MP Preapproval ID</label>
                        <Input
                            value={form.mp_preapproval_id ?? ""}
                            onChange={(e) => setForm((s) => ({ ...s, mp_preapproval_id: e.target.value || null }))}
                            placeholder="ID do provedor (opcional)"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={onSubmit} disabled={loading || !canEdit}>
                        {isNew ? "Criar" : "Salvar"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}