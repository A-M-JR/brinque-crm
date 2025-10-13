"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth/hasPermission";
import { listarPlanosPorFranchise, criarAssinatura } from "@/lib/supabase/subscriptions";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";

type CompanyRow = { id: number; name: string };
type PlanRow = { id: number; name: string; default_price: number; billing_cycle?: string | null };

export default function NovaAssinaturaPage() {
    const router = useRouter();
    const { group, franchise } = useAuth();
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const franchiseId = (franchise?.id as number | undefined) ?? undefined;

    const canEdit = hasPermission("assinaturas", "edit", groupPermissions, franchiseModules);
    if (!canEdit) {
        return (
            <div className="p-6">
                <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Você não tem permissão para criar assinaturas.</p>
                </Card>
            </div>
        );
    }

    // Dados
    const [companies, setCompanies] = useState<CompanyRow[]>([]);
    const [plans, setPlans] = useState<PlanRow[]>([]);

    // Form state
    const [companyId, setCompanyId] = useState<string>(""); // Select safe: string
    const [planId, setPlanId] = useState<string>("");
    const [planNameSnapshot, setPlanNameSnapshot] = useState<string>("");
    const [valorUS, setValorUS] = useState<string>(""); // 1234.56
    const [status, setStatus] = useState<"authorized" | "paused" | "cancelled" | "expired" | "finished">("authorized");
    const [currency] = useState("BRL");
    const [mpPreapprovalId, setMpPreapprovalId] = useState<string>("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!franchiseId) return;
        // Carregar clientes
        (async () => {
            const { data, error } = await supabase
                .from("crm_companies")
                .select("id, name")
                .eq("franchise_id", franchiseId)
                .eq("status", true)
                .order("name", { ascending: true });
            if (!error && data) {
                setCompanies(data.map((c) => ({ id: Number(c.id), name: String(c.name) })));
            }
        })();
    }, [franchiseId]);

    useEffect(() => {
        if (!franchiseId) return;
        // Carregar planos ativos
        (async () => {
            const data = await listarPlanosPorFranchise(franchiseId);
            setPlans(data as unknown as PlanRow[]);
        })();
    }, [franchiseId]);

    // Ao escolher plano, sugere o preço padrão e congela o nome
    useEffect(() => {
        const p = plans.find((x) => String(x.id) === planId);
        if (p) {
            setPlanNameSnapshot(p.name);
            const preco = Number(p.default_price ?? 0);
            setValorUS(Number.isFinite(preco) ? preco.toFixed(2) : "");
        }
    }, [planId, plans]);

    const disableSubmit = useMemo(() => {
        if (!companyId || companyId === "all") return true;
        if (!planId || planId === "all") return true;
        const valueNum = Number((valorUS || "").replace(/[^0-9.]/g, ""));
        if (!Number.isFinite(valueNum) || valueNum < 0) return true;
        return false;
    }, [companyId, planId, valorUS]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!franchiseId) return;

        setSaving(true);
        try {
            const amount = Number((valorUS || "").replace(/[^0-9.]/g, "")) || 0;
            const amount_cents = Math.round(amount * 100);

            await criarAssinatura({
                franchise_id: franchiseId,
                subscription_plan_id: Number(planId),
                company_id: Number(companyId),
                user_id: null,
                plan_name: planNameSnapshot || (plans.find((p) => String(p.id) === planId)?.name ?? ""),
                amount_cents,
                currency,
                status,
                mp_preapproval_id: mpPreapprovalId || null,
                raw: null,
            });

            router.push("/assinaturas");
        } catch (error) {
            console.error("Erro ao criar assinatura:", error);
            setSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-4 max-w-4xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost">
                        <Link href="/assinaturas">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Voltar
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Nova Assinatura</h1>
                </div>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cliente */}
                    <div className="space-y-2">
                        <Label>Cliente</Label>
                        <Select value={companyId || "all"} onValueChange={setCompanyId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Selecione...</SelectItem>
                                {companies.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Plano */}
                    <div className="space-y-2">
                        <Label>Plano</Label>
                        <Select value={planId || "all"} onValueChange={setPlanId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um plano" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Selecione...</SelectItem>
                                {plans.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name} {p.billing_cycle ? `(${p.billing_cycle})` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Snapshot do nome do plano */}
                    <div className="space-y-2">
                        <Label>Nome do plano (snapshot)</Label>
                        <Input
                            value={planNameSnapshot}
                            onChange={(e) => setPlanNameSnapshot(e.target.value)}
                            placeholder="Nome congelado do plano"
                        />
                    </div>

                    {/* Valor em reais (padrão americano) */}
                    <div className="space-y-2">
                        <Label>Preço (R$)</Label>
                        <Input
                            value={valorUS}
                            onChange={(e) => setValorUS(e.target.value)}
                            inputMode="decimal"
                            placeholder="Ex.: 99.90"
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
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

                    {/* Moeda (fixo BRL) */}
                    <div className="space-y-2">
                        <Label>Moeda</Label>
                        <Input value={currency} disabled />
                    </div>

                    {/* MP Preapproval */}
                    <div className="space-y-2 md:col-span-2">
                        <Label>MP Preapproval ID</Label>
                        <Input
                            value={mpPreapprovalId}
                            onChange={(e) => setMpPreapprovalId(e.target.value)}
                            placeholder="ID do provedor (opcional)"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end pt-2">
                        <Button type="submit" disabled={saving || disableSubmit}>
                            {saving ? "Salvando..." : "Criar"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}