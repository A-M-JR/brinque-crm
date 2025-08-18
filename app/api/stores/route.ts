import { NextResponse } from "next/server";
import { listarLojas, criarLoja } from "@/lib/supabase/stores";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const franchise_id = searchParams.get("franchise_id");
  const owner_user_id = searchParams.get("owner_user_id");
  const stores = await listarLojas({
    franchise_id: franchise_id ? Number(franchise_id) : undefined,
    owner_user_id: owner_user_id ?? undefined,
  });
  return NextResponse.json({ stores });
}

export async function POST(req: Request) {
  const body = await req.json();
  // você pode validar slug único aqui se quiser
  const created = await criarLoja(body);
  return NextResponse.json({ store: created });
}
