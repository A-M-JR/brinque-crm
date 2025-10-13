"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth/hasPermission";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";

type PlanForm = {
    name: string;
    default_price: string; // 1234.56
    billing_cycle?: string | null;
    status: "true" | "false";
};

export default function PlanoAssinaturaFormPage() {
    // Hooks SEMPRE primeiro e em ordem fixa
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { group, franchise } = useAuth();

    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const franchiseId = (franchise?.id as number | undefined) ?? undefined;

    const canEdit = hasPermission("assinaturas", "edit", groupPermissions, franchiseModules);
    const isNew = params?.id === "new";

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<PlanForm>({
        name: "",
        default_price: "",
        billing_cycle: "",
        status: "true",
    });

    // Carregar plano quando for edição
    useEffect(() => {
        if (!franchiseId) return;
        if (isNew) return;

        let isCancelled = false;
        (async () => {
            const { data, error } = await supabase
                .from("crm_subscription_plans")
                .select("name, default_price, billing_cycle, status")
                .eq("id", Number(params.id))
                .eq("franchise_id", franchiseId)
                .maybeSingle();

            if (!isCancelled && !error && data) {
                setForm({
                    name: data.name ?? "",
                    default_price: Number(data.default_price ?? 0).toFixed(2),
                    billing_cycle: data.billing_cycle ?? "",
                    status: data.status ? "true" : "false",
                });
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, [isNew, params.id, franchiseId]);

    const disableSubmit = useMemo(() => {
        if (!form.name.trim()) return true;
        const v = Number((form.default_price || "").replace(/[^0-9.]/g, ""));
        if (!Number.isFinite(v) || v < 0) return true;
        return false;
    }, [form]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!franchiseId) return;

        setLoading(true);
        try {
            const payload = {
                franchise_id: franchiseId,
                name: form.name.trim(),
                default_price: Number((form.default_price || "").replace(/[^0-9.]/g, "")),
                billing_cycle: form.billing_cycle?.trim() || null,
                status: form.status === "true",
            };

            if (isNew) {
                const { error } = await supabase.from("crm_subscription_plans").insert([payload]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("crm_subscription_plans")
                    .update(payload)
                    .eq("id", Number(params.id))
                    .eq("franchise_id", franchiseId);
                if (error) throw error;
            }

            router.push("/planos-assinatura");
        } catch (error) {
            console.error("Erro ao salvar plano:", error);
            setLoading(false);
        }
    };

    // IMPORTANTE: evite early return antes dos hooks; aqui está OK porque todos os hooks já foram declarados
    if (!canEdit) {
        return (
            <div className="p-6">
                <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Você não tem permissão para gerenciar planos de assinatura.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
                <Button asChild variant="ghost">
                    <Link href="/planos-assinatura">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Voltar
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold">{isNew ? "Novo Plano" : "Editar Plano"}</h1>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label>Nome</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Ex.: Plano Mensal"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Preço padrão (R$)</Label>
                        <Input
                            value={form.default_price}
                            onChange={(e) => setForm((f) => ({ ...f, default_price: e.target.value }))}
                            inputMode="decimal"
                            placeholder="Ex.: 99.90"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Ciclo de cobrança</Label>
                        <Select
                            value={form.billing_cycle || "custom"}
                            onValueChange={(v) => setForm((f) => ({ ...f, billing_cycle: v === "custom" ? "" : v }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o ciclo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Mensal</SelectItem>
                                <SelectItem value="quarterly">Trimestral</SelectItem>
                                <SelectItem value="semiannual">Semestral</SelectItem>
                                <SelectItem value="annual">Anual</SelectItem>
                                <SelectItem value="custom">Outro (preencher manualmente)</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.billing_cycle === "" && (
                            <Input
                                className="mt-2"
                                placeholder="Descreva o ciclo (ex.: 28 dias)"
                                onChange={(e) => setForm((f) => ({ ...f, billing_cycle: e.target.value }))}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as "true" | "false" }))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Ativo</SelectItem>
                                <SelectItem value="false">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-2 flex justify-end pt-2">
                        <Button type="submit" disabled={loading || disableSubmit}>
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}