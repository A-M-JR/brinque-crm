import { supabase } from "./client";

// --- Tipagens para os dados dos Relatórios ---

export type ReportKpi = {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
};

export type SalesReportData = {
    month: string;
    vendas: number;
    receita: number;
};

export type UserReportData = {
    month: string;
    novos: number;
    ativos: number;
};

// Objeto principal que a página irá receber
export type ReportData = {
    salesKpis: ReportKpi[];
    userKpis: ReportKpi[];
    salesReportData: SalesReportData[];
    userReportData: UserReportData[];
    // Adicione aqui os tipos para os relatórios de Financeiro e Produtos
};

/**
 * Busca todos os dados agregados para a página de relatórios.
 * ATENÇÃO: Esta é uma função de exemplo. Você precisará de implementar
 * as consultas SQL reais para buscar estes dados das suas tabelas.
 * @param franchiseId O ID da empresa para a qual os dados serão buscados.
 * @param period O período selecionado (ex: "6m", "1y").
 */
export async function getReportData(franchiseId: number, period: string): Promise<ReportData> {
    // Simula uma chamada à API para buscar os dados
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- DADOS DE EXEMPLO DINÂMICOS ---
    // No seu sistema real, você substituiria isto por consultas complexas ao Supabase
    // que filtram por franchiseId e pelo período de tempo.
    const salesKpis = [
        { title: 'Total de Vendas', value: `${Math.floor(Math.random() * 15000 + 3000)}`, change: `+${(Math.random() * 15).toFixed(1)}%`, changeType: 'increase' as const },
        { title: 'Receita Total', value: `R$ ${(Math.random() * 100000 + 10000).toLocaleString('pt-BR')}`, change: `+${(Math.random() * 10).toFixed(1)}%`, changeType: 'increase' as const },
        { title: 'Ticket Médio', value: `R$ ${(Math.random() * 50 + 5).toFixed(2)}`, change: `-${(Math.random() * 5).toFixed(1)}%`, changeType: 'decrease' as const },
    ];

    const userKpis = [
        { title: 'Novos Usuários', value: `${Math.floor(Math.random() * 500 + 100)}`, change: `+${(Math.random() * 20).toFixed(1)}%`, changeType: 'increase' as const },
        { title: 'Usuários Ativos', value: `${Math.floor(Math.random() * 2000 + 500)}`, change: `+${(Math.random() * 8).toFixed(1)}%`, changeType: 'increase' as const },
        { title: 'Taxa de Retenção', value: `${Math.floor(Math.random() * 20 + 70)}%`, change: `+${(Math.random() * 3).toFixed(1)}%`, changeType: 'increase' as const },
    ];

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    const salesReportData = months.map(month => ({
        month,
        vendas: Math.floor(Math.random() * 4000 + 1000),
        receita: Math.floor(Math.random() * 20000 + 10000),
    }));

    const userReportData = months.map(month => ({
        month,
        novos: Math.floor(Math.random() * 100 + 50),
        ativos: Math.floor(Math.random() * 400 + 100),
    }));

    return { salesKpis, userKpis, salesReportData, userReportData };
}
