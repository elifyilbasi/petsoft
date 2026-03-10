import { User as NextUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: NextUser & {
      id: string;
      hasPaid: boolean;
    };
  }
  interface User {
    email: string;
    hasPaid: boolean;
  }
}
