import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { countryToLocale, defaultLocale } from "./i18n/config";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if URL already has a locale prefix
  const hasLocale = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // If no locale prefix and no locale cookie, geo-detect
  if (!hasLocale && !request.cookies.get("NEXT_LOCALE")) {
    const country = request.headers.get("x-vercel-ip-country") || "";
    const detectedLocale = countryToLocale[country] || defaultLocale;

    if (detectedLocale !== defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${detectedLocale}${pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set("NEXT_LOCALE", detectedLocale, { maxAge: 60 * 60 * 24 * 365 });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|uploads|.*\\..*).*)",
  ],
};
