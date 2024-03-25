"use client";

import React from "react";
import { createClient } from "@supabase/supabase-js";

import { Input } from "~/components/ui/input";
import toast from "react-hot-toast";
import { ScrollArea } from "~/components/ui/scroll-area";

export interface Message {
  id: string;
  created_at: string;
  content: string;
  user_name: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Props = {
  initialMessages: Message[];
};

export default function RealtimeChat({ initialMessages }: Props) {
  const [username, setUsername] = React.useState<string | undefined>(undefined);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => setMessages((prev) => [...prev, payload.new as Message]),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const formData = new FormData(ev.target as HTMLFormElement);
    const content = formData.get("content");
    if (!content) return;

    formRef.current?.reset();

    try {
      await supabase
        .from("messages")
        .insert({ content: content, user_name: "ahm0xc" });
    } catch (error) {
      toast.error("Error while sending message");
      console.log(error);
    }
  }

  function handleUsername(ev: React.FormEvent) {
    ev.preventDefault();
    const formData = new FormData(ev.target as HTMLFormElement);
    const _username = formData.get("username");
    if (!_username) return;

    setUsername(_username as string);
  }

  if (!username) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center">
        <form onSubmit={handleUsername} className="w-full">
          <Input placeholder="type your username" name="username" />
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col py-20">
      <ScrollArea className="flex h-[70vh] flex-1 flex-col justify-end space-y-4 overflow-y-scroll pb-4">
        <div className="space-y-4 pb-6">
          {messages.map((message) => {
            return (
              <div key={message.id} className="flex items-center gap-4">
                {/*    eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${message.user_name}`}
                  className="h-7 w-7 object-contain"
                  alt=""
                />
                <p className="text-xl">{message.content}</p>
              </div>
            );
          })}
          {/* <div /> */}
        </div>
      </ScrollArea>
      <div className="">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex items-center gap-1"
        >
          <Input ref={inputRef} placeholder="type the message" name="content" />
          <button
            className="rounded-md bg-white px-1.5 py-1.5 text-black"
            type="submit"
            aria-label="send"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-send"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
