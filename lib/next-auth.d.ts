import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    hasPaid: boolean;
    email: string;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    email: string;
  }
}
