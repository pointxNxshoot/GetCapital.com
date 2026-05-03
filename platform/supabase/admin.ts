import { createClient } from "@supabase/supabase-js";

// Admin client bypasses RLS — use ONLY in server-side code (background jobs, admin actions)
// NEVER import this from any client-side code
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Re-export the standard clients from the canonical location
export { createClient as createServerClient } from "@/lib/supabase/server";
export { createClient as createBrowserClient } from "@/lib/supabase/client";

