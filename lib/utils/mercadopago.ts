// import type { SubscriptionStatus } from "@/lib/supabase/subscriptions";

// const ALLOWED: SubscriptionStatus[] = ["authorized", "paused", "cancelled", "expired", "finished", null];

// export function toSubscriptionStatus(value: string | null | undefined): SubscriptionStatus {
//   if (value === null || value === undefined) return null;
//   return (ALLOWED as readonly string[]).includes(value as any)
//     ? (value as SubscriptionStatus)
//     : null;
// }
