import { createBrowserClient } from "@supabase/ssr";
// import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  throw new Error("No supabase url");
}
if (!anon_key) {
  throw new Error("No anon key url");
}

export const supabaseClient = createBrowserClient(url, anon_key);
