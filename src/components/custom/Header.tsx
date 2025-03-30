"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-chatbot-dark to-chatbot-darker shadow-lg border-b border-white/10">
      <h1 className="text-xl font-bold text-white">LangCorp</h1>
      {session && (
        <Button onClick={() => signOut()} variant="outline" className="text-black border-white/30">
          Log-Out
        </Button>
      )}
    </div>
  );
}
