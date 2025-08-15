"use client";

import { CardPayment } from "@mercadopago/sdk-react";
import { useCallback } from "react";

export default function CardCheckout({ orderId }: { orderId: string }) {
  const onSubmit = useCallback(async (cardFormData: any) => {
    // o Brick já valida e retorna token + payer
    const { token, payment_method_id, issuer_id, installments, payer } = cardFormData;

    const res = await fetch("/api/payments/create-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        token,
        installments: Number(installments),
        payer: {
          email: payer.email,
          identification: payer.identification,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Falha no pagamento");
    alert(`Status: ${data.payment?.status}`);
  }, [orderId]);

  return (
    <div className="rounded-2xl border p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Pagar com cartão</h2>
      <CardPayment
        initialization={{ amount: 0 }} // valor real é verificado no servidor
        customization={{ visual: { style: { theme: "default" } } }}
        onSubmit={onSubmit}
      />
    </div>
  );
}
