"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthFormBtn({ type }: AuthFormProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="mt-4" disabled={pending}>
      {type === "login" ? "Log In" : "Sign Up"}
    </Button>
  );
}
