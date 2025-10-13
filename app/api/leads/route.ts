// /app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { criarLead } from '@/lib/supabase/leads';

// --- NOVO: Handler para a requisição pre-flight OPTIONS ---
export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            // 'Access-Control-Allow-Origin': 'https://www.brinquebrinque.com.br',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(request: Request) {
    // --- NOVO: Verificação de Segurança com Token ---
    // 1. Obtenha o token do cabeçalho da requisição
    const authHeader = request.headers.get('authorization');
    // 2. Defina o seu token secreto (deve vir de variáveis de ambiente)
    const secretToken = "5EDB46DEBC170AAB3906E0FA9D772EF8";

    // 3. Verifique se o token foi enviado e se corresponde ao seu segredo
    if (!secretToken || authHeader !== `Bearer ${secretToken}`) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
    }
    // --- FIM DA VERIFICAÇÃO DE SEGURANÇA ---

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const body = await request.json();
        const { name, email, cpf, phone, city, state, franchise_id, ...formDataJson } = body;

        if (!name || !email || !franchise_id) {
            return NextResponse.json(
                { error: 'Nome, email e ID da empresa são obrigatórios.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const novoLead = await criarLead({
            name, email, cpf, phone, city, state, franchise_id,
            status: 'novo',
            form_data: formDataJson,
        });

        return NextResponse.json(
            { message: 'Lead recebido com sucesso!', data: novoLead },
            { status: 201, headers: corsHeaders }
        );

    } catch (error: any) {
        console.error('Erro na API de Leads:', error);
        return NextResponse.json(
            { error: 'Ocorreu um erro interno no servidor.', details: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
