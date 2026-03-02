import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TransOglasi - Trans oglasi za Balkan",
    template: "%s | TransOglasi",
  },
  description:
    "Najveći portal za trans oglase na Balkanu. Besplatno postavljanje oglasa iz Hrvatske, Srbije, BiH, Crne Gore i cijele regije.",
  keywords: [
    "transice oglasi",
    "trans oglasi",
    "transica zagreb",
    "shemale croatia",
    "trans oglasi beograd",
    "trans oglasi sarajevo",
  ],
  openGraph: {
    type: "website",
    siteName: "TransOglasi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
