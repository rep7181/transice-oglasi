import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Transice-Oglasi.com - Besplatni trans oglasi za Balkan",
    template: "%s",
  },
  description:
    "Besplatni trans oglasi i osobni kontakti. Hrvatska, Srbija, BiH, Crna Gora, Slovenija, Makedonija. Escort, masaža, upoznavanje. 100% besplatno.",
  keywords: [
    "trans oglasi",
    "transice oglasi",
    "trans escort",
    "trans oglasi zagreb",
    "trans oglasi beograd",
    "trans oglasi sarajevo",
    "trans oglasi hrvatska",
    "trans oglasi srbija",
    "trans kontakti",
    "besplatni trans oglasi",
  ],
  verification: {
    google: "4NwsifZZq4i8r-BVS7gm2ZCT92uUpxPWtkI5EgiKSQ8",
  },
  openGraph: {
    type: "website",
    siteName: "Transice-Oglasi.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
