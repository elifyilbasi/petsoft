import { NextResponse } from "next/server";
import { auth as authMiddleware } from "./lib/auth";

const proxy = authMiddleware((req) => {
  const isLoggedIn = Boolean(req.auth?.user);
  const isTryingToAccessApp = req.nextUrl.pathname.startsWith("/app");

  if (!isLoggedIn && isTryingToAccessApp) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export default proxy;
export const auth = proxy;
