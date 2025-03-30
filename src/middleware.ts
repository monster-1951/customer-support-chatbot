import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/register", "/login", "/"], // Middleware applies to these paths
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  // console.log("These are from middleware")
  // console.log("User Email:", token?.email || "Not Set");
  // console.log("User Mobile:", token?.mobile || "Not Set");
  // If user is authenticated and tries to access /register or /login, redirect to home
  if (token && (url.pathname === "/register" || url.pathname === "/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is NOT authenticated and tries to access "/", redirect to /login
  if (!token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
