import { buscarLojaPorSlug, listarProdutosDaLoja } from "@/lib/supabase/stores";
import { supabase } from "@/lib/supabase/client";

type Params = { params: { slug: string } };

export default async function LojaPublicaPage({ params }: Params) {
  const store = await buscarLojaPorSlug(params.slug);

  if (!store?.is_active) {
    return <main className="p-10 text-center">Loja indisponível.</main>;
  }

  // Carrega produtos vinculados e visíveis
  const items = await (async () => {
    const { data, error } = await supabase
      .from("crm_store_products")
      .select("*, product:crm_products(id, name, price, images, show_on_store)")
      .eq("store_id", store.id)
      .eq("show", true)
      .order("sort_order");
    if (error) throw error;
    return data as any[];
  })();

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Header simples */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{store.name}</h1>
          {store.description && <p className="text-muted-foreground">{store.description}</p>}
        </div>
        {store.logo_url && <img src={store.logo_url} alt="logo" className="h-12 w-auto" />}
      </div>

      {/* Grid de produtos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const p = it.product;
          const price = (it.price_override_cents ?? p.price * 100) / 100;
          const img = Array.isArray(p.images) && p.images[0]?.url ? p.images[0].url : undefined;

          return (
            <div key={p.id} className="rounded-2xl border p-4 hover:shadow">
              {img && <img src={img} alt={p.name} className="mb-3 h-40 w-full rounded-lg object-cover" />}
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm">R$ {price.toFixed(2).replace(".", ",")}</p>

              {/* CTA — aqui você pluga seu fluxo de checkout */}
              <form action="/loja/checkout" method="post" className="mt-3">
                <input type="hidden" name="store_id" value={store.id} />
                <input type="hidden" name="product_id" value={p.id} />
                <button className="mt-1 rounded-lg border px-3 py-2 text-sm">Comprar</button>
              </form>
            </div>
          );
        })}
      </div>
    </main>
  );
}
