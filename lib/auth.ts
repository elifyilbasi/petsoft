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
    authorized: ({ auth, request }) => {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      const hasPaid = Boolean(auth?.user?.hasPaid);

      const isAppRoute = pathname.startsWith("/app");
      const isAuthRoute = pathname === "/login" || pathname === "/signup";
      const isPaymentRoute = pathname === "/payment";

      if (!isLoggedIn) {
        if (isAppRoute)
          return Response.redirect(new URL("/login", request.url));
        return true;
      }

      if (!hasPaid) {
        if (isAppRoute || isAuthRoute) {
          return Response.redirect(new URL("/payment", request.url));
        }
        return true;
      }

      if (isAuthRoute || isPaymentRoute) {
        return Response.redirect(new URL("/app/dashboard", request.url));
      }

      return true;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.hasPaid = user.hasPaid;
      }

      if (trigger === "update") {
        const sessionUser = await getUserByEmail(token.email);
        if (sessionUser) {
          token.hasPaid = sessionUser.hasPaid;
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId as string;
      session.user.hasPaid = Boolean(token.hasPaid);

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;
