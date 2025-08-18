"use client";

import { useEffect, useState } from "react";
import { Wallet } from "@mercadopago/sdk-react";

export default function WalletCheckout({ orderId }: { orderId: string }) {
  const [prefId, setPrefId] = useState<string>();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/payments/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          title: "Pedido da Loja",
          quantity: 1,
          unit_price: 10.0, // server valida de qualquer forma
        }),
      });
      const data = await res.json();
      setPrefId(data.id);
    })();
  }, [orderId]);

  return (
    <div className="rounded-2xl border p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Pagar com carteira Mercado Pago</h2>
      {prefId && <Wallet initialization={{ preferenceId: prefId }} />}
    </div>
  );
}
