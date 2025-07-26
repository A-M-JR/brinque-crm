import { supabase } from "./client";

// --- Tipagens baseadas nas suas novas tabelas ---

export type SubscriptionPlan = {
    id: number;
    created: string;
    name: string;
    type: 'acesso_plataforma' | 'aluguel_brinquedos';
    default_price: number;
    billing_cycle: 'mensal' | 'anual';
    status: boolean;
    details: Record<string, any> | null; // JSONB
    franchise_id: number;
};

export type Subscription = {
    id: number;
    created: string;
    customer_id: number;
    plan_id: number;
    value: number;
    status: 'ativa' | 'pausada' | 'cancelada' | 'inadimplente';
    start_date: string;
    end_date: string | null;
    next_billing_date: string | null;
    metadata: Record<string, any> | null; // JSONB
    // Propriedade que virá do join com a tabela de planos
    crm_subscription_plans: {
        name: string;
    } | null;
};

// --- Funções para Planos de Assinatura (crm_subscription_plans) ---

export async function listarPlanosPorFranchise(franchiseId: number): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
        .from("crm_subscription_plans")
        .select("*")
        .eq("franchise_id", franchiseId)
        .eq("status", true)
        .order("name");

    if (error) {
        console.error("Erro ao listar planos:", error);
        throw error;
    }
    return data as SubscriptionPlan[];
}

// --- Funções para Assinaturas dos Clientes (crm_subscriptions) ---

/**
 * Lista todas as assinaturas de um cliente específico.
 */
export async function listarAssinaturasPorCliente(customerId: number): Promise<Subscription[]> {
    // CORRIGIDO: A sintaxe do .select() foi ajustada para ser mais explícita e robusta.
    const { data, error } = await supabase
        .from("crm_subscriptions")
        .select("*, crm_subscription_plans(name)") // Traz o nome do plano da tabela relacionada
        .eq("customer_id", customerId)
        .order("created", { ascending: false });

    if (error) {
        console.error("Erro ao listar assinaturas do cliente:", error);
        throw error;
    }
    return data as Subscription[];
}

/**
 * Cria uma nova assinatura para um cliente.
 */
export async function criarAssinatura(subscriptionData: Omit<Subscription, 'id' | 'created' | 'crm_subscription_plans'>): Promise<Subscription> {
    const { data, error } = await supabase
        .from("crm_subscriptions")
        .insert([subscriptionData])
        .select()
        .single();

    if (error) {
        console.error("Erro ao criar assinatura:", error);
        throw error;
    }
    return data as Subscription;
}

/**
 * Atualiza o status de uma assinatura (ex: cancelar).
 */
export async function atualizarStatusAssinatura(id: number, status: Subscription['status']): Promise<Subscription> {
    const { data, error } = await supabase
        .from("crm_subscriptions")
        .update({ status, end_date: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(`Erro ao atualizar assinatura ${id}:`, error);
        throw error;
    }
    return data as Subscription;
}
