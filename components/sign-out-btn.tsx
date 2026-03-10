"use client";

// client‑side helper from next-auth/react avoids pulling in any server/database code
import { signOut } from "next-auth/react";
import { useTransition } from "react";

import { Button } from "./ui/button";

export default function SignOutBtn() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        startTransition(async () => {
          await signOut();
        });
      }}
    >
      Sign Out
    </Button>
  );
}
