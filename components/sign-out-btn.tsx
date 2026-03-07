"use client";

// client‑side helper from next-auth/react avoids pulling in any server/database code
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignOutBtn() {
  return <Button onClick={async () => await signOut()}>Sign Out</Button>;
}
