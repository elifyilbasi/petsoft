import { NextResponse } from "next/server";

import { auth as authMiddleware } from "./lib/auth";

const proxy = authMiddleware((req) => {
  const isLoggedIn = Boolean(req.auth?.user);
  const isTryingToAccessApp = req.nextUrl.pathname.startsWith("/app");
  const isOnAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  if (!isLoggedIn && isTryingToAccessApp) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
  if (isLoggedIn && !isTryingToAccessApp) {
    debugger;
    if (
      req.nextUrl.pathname.includes("/login") ||
      req.nextUrl.pathname.includes("/signup")
    ) {
      return Response.redirect(new URL("/payment", req.nextUrl));
    }
  }
  if (isLoggedIn && isOnAuthPage) {
    return Response.redirect(new URL("/app/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export default proxy;
export const auth = proxy;
