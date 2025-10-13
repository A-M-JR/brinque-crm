"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth/hasPermission";
import { supabase } from "@/lib/supabase/client";
import { Plus, Pencil } from "lucide-react";

type PlanRow = {
    id: number;
    name: string;
    default_price: number; // reais
    billing_cycle?: string | null;
    status: boolean;
    created_at?: string | null;
};

export default function PlanosAssinaturaPage() {
    const { group, franchise } = useAuth();
    const groupPermissions = group?.permissions ?? {};
    const franchiseModules = franchise?.modules_enabled ?? [];
    const franchiseId = (franchise?.id as number | undefined) ?? undefined;

    const canView = hasPermission("assinaturas", "view", groupPermissions, franchiseModules);
    const canEdit = hasPermission("assinaturas", "edit", groupPermissions, franchiseModules);

    const [plans, setPlans] = useState<PlanRow[]>([]);

    useEffect(() => {
        if (!canView || !franchiseId) return;
        (async () => {
            const { data, error } = await supabase
                .from("crm_subscription_plans")
                .select("id, name, default_price, billing_cycle, status, created_at")
                .eq("franchise_id", franchiseId)
                .order("created_at", { ascending: false });
            if (!error && data) {
                setPlans(data as PlanRow[]);
            }
        })();
    }, [canView, franchiseId]);

    if (!canView) {
        return (
            <div className="p-6">
                <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Você não tem permissão para visualizar planos de assinatura.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Planos de assinatura</h1>
                {canEdit && (
                    <Link href="/planos-assinatura/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Plano
                        </Button>
                    </Link>
                )}
            </div>

            <Card className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left">Nome</th>
                            <th className="px-4 py-3 text-left">Ciclo</th>
                            <th className="px-4 py-3 text-left">Preço padrão</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Criado em</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.length > 0 ? (
                            plans.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-4 py-3">{p.name}</td>
                                    <td className="px-4 py-3">{p.billing_cycle || "-"}</td>
                                    <td className="px-4 py-3">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.default_price || 0)}
                                    </td>
                                    <td className="px-4 py-3">{p.status ? "Ativo" : "Inativo"}</td>
                                    <td className="px-4 py-3">
                                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {canEdit && (
                                            <Link href={`/planos-assinatura/${p.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Pencil className="h-4 w-4 mr-1" />
                                                    Editar
                                                </Button>
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                                    Nenhum plano encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}