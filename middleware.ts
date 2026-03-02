import { NextResponse, type NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "fr"];
const DEFAULT_LOCALE = "en";

function extractLocale(pathname: string): string | null {
  const first = pathname.split("/")[1];
  return SUPPORTED_LOCALES.includes(first) ? first : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/brands") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const locale = extractLocale(pathname) ?? DEFAULT_LOCALE;

  // Strip locale prefix so Next.js routes resolve without it
  const stripped = locale === extractLocale(pathname)
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname;

  const url = request.nextUrl.clone();
  url.pathname = stripped;

  const response = NextResponse.rewrite(url);
  response.headers.set("x-locale", locale);
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|brands|favicon.ico).*)"],
};
