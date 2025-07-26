import { NextRequest, NextResponse } from "next/server";
import {
    listarTodosUsuarios,
    listarUsuariosPorFranquia,
    listarUsuariosDistribuidor,
} from "@/lib/supabase/usuarios";

// GET /api/usuarios?franchise_id=1&type=admin_master
export async function GET(req: NextRequest) {
    // Busca parâmetros da query string
    const franchiseIdRaw = req.nextUrl.searchParams.get("franchise_id");
    const userType = req.nextUrl.searchParams.get("type"); // admin_master, distribuidor, revendedor, etc.

    // Validação
    if (!franchiseIdRaw) {
        return NextResponse.json(
            { error: "franchise_id é obrigatório" },
            { status: 400 }
        );
    }
    const franchiseId = Number(franchiseIdRaw);

    try {
        let usuarios = [];
        if (franchiseId === 1) {
            // superadmin
            usuarios = await listarUsuariosPorFranquia(franchiseId);
        } else if (userType === "distribuidor") {
            // distribuidor vê só ele + revendedores dele
            usuarios = await listarUsuariosDistribuidor(franchiseId);
        } else {
            // qualquer outro, só usuários da própria franquia
            usuarios = await listarUsuariosPorFranquia(franchiseId);
        }

        return NextResponse.json(usuarios);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message ?? "Erro ao buscar usuários" },
            { status: 500 }
        );
    }
}
