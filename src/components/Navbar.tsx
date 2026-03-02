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

  return (
    <header className="bg-dark text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Trans</span>
          <span className="text-2xl font-bold">Oglasi</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
            {t("home")}
          </Link>
          <Link href="/hrvatska" className="text-sm text-gray-300 hover:text-white transition">
            Hrvatska
          </Link>
          <Link href="/srbija" className="text-sm text-gray-300 hover:text-white transition">
            Srbija
          </Link>
          <Link href="/bosna-i-hercegovina" className="text-sm text-gray-300 hover:text-white transition">
            BiH
          </Link>
          <Link href="/crna-gora" className="text-sm text-gray-300 hover:text-white transition">
            Crna Gora
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          {user ? (
            <>
              <Link href="/profil" className="text-sm text-gray-300 hover:text-white transition">
                {user.name}
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-sm text-accent hover:text-yellow-300 transition">
                  {t("admin")}
                </Link>
              )}
              <Link
                href="/oglas/novi"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {t("postAd")}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-300 hover:text-white transition">
                {t("login")}
              </Link>
              <Link
                href="/registracija"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
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
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-dark-light border-t border-gray-700 px-4 py-4 space-y-3">
          <Link href="/" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            {t("home")}
          </Link>
          <Link href="/hrvatska" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Hrvatska
          </Link>
          <Link href="/srbija" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Srbija
          </Link>
          <Link href="/bosna-i-hercegovina" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            BiH
          </Link>
          <hr className="border-gray-700" />
          <LanguageSwitcher />
          <hr className="border-gray-700" />
          {user ? (
            <>
              <Link href="/profil" className="block text-gray-300 hover:text-white">
                {t("profile")}
              </Link>
              <Link href="/oglas/novi" className="block bg-primary text-white px-4 py-2 rounded-lg text-center font-medium">
                {t("postAd")}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-300 hover:text-white">
                {t("login")}
              </Link>
              <Link href="/registracija" className="block bg-primary text-white px-4 py-2 rounded-lg text-center font-medium">
                {t("register")}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
