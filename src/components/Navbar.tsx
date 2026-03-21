"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  user?: { name: string; role: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const t = useTranslations("common");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/" as const, label: "Trans Oglasi" },
    { href: "/oglas/novi" as const, label: t("postAd") },
    { href: "/hrvatska" as const, label: "Hrvatska" },
    { href: "/srbija" as const, label: "Srbija" },
    { href: "/bosna-i-hercegovina" as const, label: "BiH" },
    { href: "/crna-gora" as const, label: "Crna Gora" },
    { href: "/slovenija" as const, label: "Slovenija" },
    { href: "/sjeverna-makedonija" as const, label: "Makedonija" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Logo bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-black text-primary">Transice</span>
            <span className="text-2xl font-black text-accent">-Oglasi</span>
            <span className="text-xl font-black text-primary">.com</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user?.role === "ADMIN" && (
              <Link href="/admin" className="text-sm text-accent font-bold">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-gray-200 hover:bg-primary-light hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center justify-between py-2">
            <span className="text-sm font-medium">Menu</span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-primary-dark border-t border-primary-light px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-3 text-gray-200 hover:bg-primary-light hover:text-white rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-primary-light" />
            {user?.role === "ADMIN" && (
              <Link href="/profil" className="block py-2 px-3 text-gray-200 hover:text-white" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
