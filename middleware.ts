import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("Middleware is running for:", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    console.log("No token found, redirecting to /auth/login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }



  // Restrict provider-only pages
  if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "ADMIN") {
    console.log("Unauthorized access to admin, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/provider") && token.role !== "PROVIDER") {
    console.log("Unauthorized access to provider, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Ensure middleware only applies to protected routes
export const config = {
  matcher: ["/admin/:path*", "/provider/:path*"], // Only runs on these paths
};
