// SDK v2
import { MercadoPagoConfig, Payment, Preference, PreApproval } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN!;
if (!accessToken) throw new Error("MP_ACCESS_TOKEN não definido");

export const mp = new MercadoPagoConfig({ accessToken });

// Exporte as resources prontas pra usar nas APIs
export const mpPayment = new Payment(mp);
export const mpPreference = new Preference(mp);
export const mpPreapproval = new PreApproval(mp);
