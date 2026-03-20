import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    // DB not connected yet
  }

  return (
    <html lang={locale}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EJGVS5EVB5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EJGVS5EVB5');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Script
          src="https://bngprm.com/promo.php?type=chat_head&c=750034&lang=&ch%5Bmodel_zone%5D=free&ch%5Blanding%5D=chat&ch%5Bleft%5D=95&ch%5Btop%5D=95&ch%5Banimation%5D=1&ch%5Btop_models%5D=1&ch%5Bfrequency%5D=43200000&ch%5Bc%5D%5B%5D=transsexual"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
