"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("common");
  const tc = useTranslations("categories");

  return (
    <footer className="bg-dark text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">{t("siteName")}</h3>
            <p className="text-sm leading-relaxed">
              {t("siteName")} - Trans oglasi Balkan.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t("countries")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hrvatska" className="hover:text-white transition">Hrvatska</Link></li>
              <li><Link href="/srbija" className="hover:text-white transition">Srbija</Link></li>
              <li><Link href="/bosna-i-hercegovina" className="hover:text-white transition">Bosna i Hercegovina</Link></li>
              <li><Link href="/crna-gora" className="hover:text-white transition">Crna Gora</Link></li>
              <li><Link href="/slovenija" className="hover:text-white transition">Slovenija</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t("categories")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?cat=escort" className="hover:text-white transition">{tc("escort")}</Link></li>
              <li><Link href="/?cat=masaza" className="hover:text-white transition">{tc("masaza")}</Link></li>
              <li><Link href="/?cat=upoznavanje" className="hover:text-white transition">{tc("upoznavanje")}</Link></li>
              <li><Link href="/?cat=webcam" className="hover:text-white transition">{tc("webcam")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t("info")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kontakt" className="hover:text-white transition">{t("contactUs")}</Link></li>
              <li><Link href="/pravila" className="hover:text-white transition">{t("terms")}</Link></li>
              <li><Link href="/privatnost" className="hover:text-white transition">{t("privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {t("siteName")}. {t("allRights")}
          </p>
          <p className="text-xs text-gray-500">{t("ageNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
