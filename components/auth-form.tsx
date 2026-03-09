import { logIn, signUp } from "@/actions/actions";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form
      action={type === "login" ? logIn : signUp}
      className="max-w-sm mx-auto mt-10"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" required />
      </div>

      <div className="mb-4 mt-2 space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" required />
      </div>
      <Button type="submit" className="mt-4">
        {type === "login" ? "Log In" : "Sign Up"}
      </Button>
    </form>
  );
}
