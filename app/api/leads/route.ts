import { NextResponse } from 'next/server';
import { criarLead } from '@/lib/supabase/leads'; // A nossa nova função Supabase

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // --- Separa os dados essenciais dos dados adicionais ---
        const {
            // Dados para colunas dedicadas
            name,
            email,
            cpf,
            phone,
            city,
            state,
            franchise_id,
            // O resto dos dados do formulário vai para o JSONB
            ...formDataJson
        } = body;

        // --- Validação dos Dados Essenciais ---
        if (!name || !email || !franchise_id) {
            return NextResponse.json(
                { error: 'Nome, email e ID da empresa são obrigatórios.' },
                { status: 400 }
            );
        }

        // --- Criação do Lead no Banco de Dados ---
        const novoLead = await criarLead({
            // Dados para as colunas principais
            name,
            email,
            cpf,
            phone,
            city,
            state,
            franchise_id,
            status: 'novo', // Status inicial padrão

            // O restante dos dados é salvo na coluna 'form_data'
            form_data: formDataJson,
        });

        // --- Resposta de Sucesso ---
        // Você pode adicionar lógicas aqui, como enviar um email de notificação

        return NextResponse.json({ message: 'Lead recebido com sucesso!', data: novoLead }, { status: 201 });

    } catch (error: any) {
        console.error('Erro na API de Leads:', error);
        return NextResponse.json(
            { error: 'Ocorreu um erro interno no servidor.', details: error.message },
            { status: 500 }
        );
    }
}
