import { NextResponse } from "next/server";
import { buscarLojaPorId, atualizarLoja, excluirLoja } from "@/lib/supabase/stores";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const store = await buscarLojaPorId(params.id);
  return NextResponse.json({ store });
}

export async function PATCH(req: Request, { params }: Params) {
  const updates = await req.json();
  const store = await atualizarLoja(params.id, updates);
  return NextResponse.json({ store });
}

export async function DELETE(_req: Request, { params }: Params) {
  await excluirLoja(params.id);
  return NextResponse.json({ ok: true });
}
