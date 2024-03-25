import { createServerClient } from "@supabase/ssr";

function createClient() {
  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {},
    },
  );
}

export const supabaseServerClient = createClient();
