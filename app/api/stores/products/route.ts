import { NextResponse } from "next/server";
import { listarProdutosDaLoja, upsertProdutosDaLoja, removerProdutoDaLoja } from "@/lib/supabase/stores";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const items = await listarProdutosDaLoja(params.id);
  return NextResponse.json({ items });
}

export async function POST(req: Request, { params }: Params) {
  const body = await req.json(); // [{ product_id, show?, sort_order?, price_override_cents? }, ...]
  const items = await upsertProdutosDaLoja(params.id, body);
  return NextResponse.json({ items });
}

export async function DELETE(req: Request, { params }: Params) {
  const { searchParams } = new URL(req.url);
  const product_id = Number(searchParams.get("product_id"));
  if (!product_id) return NextResponse.json({ error: "product_id obrigatório" }, { status: 400 });
  await removerProdutoDaLoja(params.id, product_id);
  return NextResponse.json({ ok: true });
}
