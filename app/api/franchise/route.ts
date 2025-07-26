import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

// API: GET /api/franchise
export async function GET(req: NextRequest) {
    const { data, error } = await supabase
        .from("crm_franchises")
        .select("id, name") // Se no banco for 'nome', use .select("id, nome")

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify(data), { status: 200 })
}
