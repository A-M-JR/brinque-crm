"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Store, Globe } from "lucide-react";

type Store = {
  id: string; name: string; slug: string; is_active: boolean; description: string | null;
};

export default function LojasPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/stores", { cache: "no-store" });
    const json = await res.json();
    setStores(json.stores ?? []);
  }
  useEffect(() => { load(); }, []);

  async function createQuick() {
    const slug = `loja-${Date.now()}`;
    const res = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Nova Loja", slug, description: null }),
    });
    const json = await res.json();
    router.push(`/lojas/${json.store.id}/edit`);
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lojas</h1>
        <Button onClick={createQuick}><Plus className="mr-2 h-4 w-4" /> Nova Loja</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stores.map(s => (
          <Card key={s.id} className="hover:shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Store className="h-4 w-4"/>{s.name}</CardTitle>
              <Badge variant={s.is_active ? "default" : "secondary"}>{s.is_active ? "Ativa" : "Inativa"}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{s.description || "Sem descrição"}</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push(`/lojas/${s.id}/edit`)}>Editar</Button>
                <Button variant="ghost" onClick={() => router.push(`/loja/${s.slug}`)}>
                  <Globe className="mr-2 h-4 w-4" /> Ver pública
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
