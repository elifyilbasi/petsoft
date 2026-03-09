import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }
        const { email, password } = validatedFormData.data;
        const user = await getUserByEmail(email);
        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword,
        );
        if (!passwordsMatch) {
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.userId = user.id;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;
