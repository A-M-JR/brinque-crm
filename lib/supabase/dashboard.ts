import { supabase } from "./client";

// --- Tipagens para os dados do Dashboard ---

export type KpiCardData = {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
};

export type DashboardData = {
    kpis: KpiCardData[];
    revenueByMonth: { name: string; receita: number }[];
    salesByCategory: { name: string; value: number; color: string }[];
    topProducts: { name: string; vendas: number; receita: string }[];
};

/**
 * Busca todos os dados agregados para o dashboard de uma franchise específica.
 * ATENÇÃO: Esta é uma função de exemplo. Você precisará de implementar
 * as consultas SQL reais para buscar estes dados das suas tabelas.
 * @param franchiseId O ID da empresa para a qual os dados serão buscados.
 */
export async function getDashboardData(franchiseId: number): Promise<DashboardData> {
    // Simula uma chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- DADOS DE EXEMPLO ---
    // No seu sistema real, você substituiria isto por consultas ao Supabase
    // Ex: const { count } = await supabase.from('crm_companies').select('*', { count: 'exact' })...

    const kpis: KpiCardData[] = [
        { title: 'Receita Total', value: `R$ ${(Math.random() * 50000 + 20000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, change: `+${(Math.random() * 20).toFixed(1)}%`, changeType: 'increase' },
        { title: 'Novos Clientes', value: `+${Math.floor(Math.random() * 100 + 50)}`, change: `+${(Math.random() * 15).toFixed(1)}%`, changeType: 'increase' },
        { title: 'Pedidos Realizados', value: `${Math.floor(Math.random() * 500 + 200)}`, change: `-${(Math.random() * 5).toFixed(1)}%`, changeType: 'decrease' },
        { title: 'Novos Leads', value: `+${Math.floor(Math.random() * 200 + 30)}`, change: `+${(Math.random() * 10).toFixed(1)}%`, changeType: 'increase' },
    ];

    const revenueByMonth = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"].map(month => ({
        name: month,
        receita: Math.floor(Math.random() * 30000 + 40000)
    }));

    const salesByCategory = [
        { name: "Brinquedos Educativos", value: 400, color: "hsl(var(--primary))" },
        { name: "Jogos de Tabuleiro", value: 300, color: "hsl(var(--primary) / 0.8)" },
        { name: "Pelúcias", value: 300, color: "hsl(var(--primary) / 0.6)" },
        { name: "Action Figures", value: 200, color: "hsl(var(--primary) / 0.4)" },
    ];

    const topProducts = [
        { name: "Kit de Blocos de Montar", vendas: Math.floor(Math.random() * 200 + 50), receita: `R$ ${(Math.random() * 20000).toLocaleString('pt-BR')}` },
        { name: "Quebra-Cabeça 1000 Peças", vendas: Math.floor(Math.random() * 150 + 40), receita: `R$ ${(Math.random() * 15000).toLocaleString('pt-BR')}` },
        { name: "Carrinho de Controle Remoto", vendas: Math.floor(Math.random() * 120 + 30), receita: `R$ ${(Math.random() * 25000).toLocaleString('pt-BR')}` },
    ];

    return { kpis, revenueByMonth, salesByCategory, topProducts };
}
