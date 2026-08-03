import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/gerenciador") ||
    request.nextUrl.pathname.startsWith("/relatorio");

  const endpoint = isAdminRoute
    ? "/users/me/admin"
    : "/users/me";

  const response = await fetch(`${process.env.API_URL}${endpoint}`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
  });

  if (!response.ok) {
    if (isAdminRoute && response.status === 403) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    const res = NextResponse.redirect(new URL("/", request.url));

    res.cookies.delete("access_token");

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/sala/:path*",
    "/minhas_reservas/:path*",
    "/gerenciador/:path*",
    "/relatorio/:path*",
  ],
};