"use client";

import { initMercadoPago, Payment, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import CardCheckout from "@/components/checkout/CardCheckout";
import PixCheckout from "@/components/checkout/PixCheckout";
import WalletCheckout from "@/components/checkout/WalletCheckout";


export default function CheckoutPage() {
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY as string, { locale: "pt-BR" });
  }, []);

  const [orderId] = useState<string>(() => crypto.randomUUID()); // exemplo; crie crm_orders antes

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {/* Cartão */}
      <CardCheckout orderId={orderId} />

      {/* PIX */}
      <PixCheckout orderId={orderId} />

      {/* Wallet (opcional) */}
      <WalletCheckout orderId={orderId} />
    </div>
  );
}
