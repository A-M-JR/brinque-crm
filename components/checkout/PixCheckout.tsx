"use client";

import { useState } from "react";

export default function PixCheckout({ orderId }: { orderId: string }) {
  const [qr, setQr] = useState<{ img?: string; code?: string; exp?: string }>();

  async function handlePix() {
    const res = await fetch("/api/payments/create-pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, customerEmail: "cliente@example.com" }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro PIX");
    setQr({ img: data.qr_base64, code: data.qr_code, exp: data.expires_at });
  }

  return (
    <div className="rounded-2xl border p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Pagar com PIX</h2>
      <button className="rounded-xl border px-4 py-2" onClick={handlePix}>Gerar QRCode</button>

      {qr?.img && (
        <div className="mt-4">
          <img src={`data:image/png;base64,${qr.img}`} alt="QR Code" className="w-48 h-48" />
          <p className="mt-2 text-sm break-all">{qr.code}</p>
          {qr.exp && <p className="text-xs text-muted-foreground">Expira: {new Date(qr.exp).toLocaleString()}</p>}
        </div>
      )}
    </div>
  );
}
