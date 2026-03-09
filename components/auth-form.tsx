"use client";

import { useActionState } from "react";

import { logIn, signUp } from "@/actions/actions";

import AuthFormBtn from "./auth-form-btn";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [loginState, loginAction] = useActionState(logIn, undefined);
  const [signUpState, signUpAction] = useActionState(signUp, undefined);

  const state = type === "login" ? loginState : signUpState;
  const action = type === "login" ? loginAction : signUpAction;

  return (
    <form action={action} className="max-w-sm mx-auto mt-10">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" required />
      </div>

      <div className="mb-4 mt-2 space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" required />
      </div>

      <AuthFormBtn type={type} />

      {state?.message && (
        <p className="mt-4 text-sm text-red-500">{state.message}</p>
      )}
    </form>
  );
}
