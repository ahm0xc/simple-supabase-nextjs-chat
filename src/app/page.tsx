import { supabaseServerClient } from "~/lib/supabase/server";
import RealtimeChat, { type Message } from "./_components/realtime-chat";

export default async function Home() {
  const { data } = await supabaseServerClient.from("messages").select("*");

  return (
    <main className="px-4">
      <RealtimeChat initialMessages={data as Message[]} />
    </main>
  );
}
