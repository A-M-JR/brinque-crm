import { supabase } from "./client";

export type WebhookLog = {
  id: number;
  source: string;       // 'mercado_pago'
  topic: string | null;
  external_id: string | null;
  headers: any;
  body: any;
  verified: boolean;
  created_at: string;
};

export async function logWebhook(input: {
  source: "mercado_pago";
  topic?: string | null;
  external_id?: string | null;
  headers?: any;
  body?: any;
  verified?: boolean;
}) {
  const { data, error } = await supabase
    .from("crm_webhook_logs")
    .insert([{
      source: input.source,
      topic: input.topic ?? null,
      external_id: input.external_id ?? null,
      headers: input.headers ?? {},
      body: input.body ?? {},
      verified: input.verified ?? false,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as WebhookLog;
}
