"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";

export default function Footer() {
  const t = useTranslations("common");

  // Major cities for quick links
  const footerCities = [
    { name: "Zagreb", path: "/hrvatska/grad-zagreb/zagreb" },
    { name: "Split", path: "/hrvatska/splitsko-dalmatinska/split" },
    { name: "Rijeka", path: "/hrvatska/primorsko-goranska/rijeka" },
    { name: "Osijek", path: "/hrvatska/osjecko-baranjska/osijek" },
    { name: "Beograd", path: "/srbija/beograd/beograd" },
    { name: "Novi Sad", path: "/srbija/vojvodina/novi-sad" },
    { name: "Sarajevo", path: "/bosna-i-hercegovina/kanton-sarajevo/sarajevo" },
    { name: "Ljubljana", path: "/slovenija/osrednjeslovenska/ljubljana" },
    { name: "Podgorica", path: "/crna-gora/podgorica/podgorica" },
    { name: "Skopje", path: "/sjeverna-makedonija/skopski/skopje" },
  ];

  return (
    <footer className="bg-primary text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="text-white font-bold mb-3 text-base">Transice-Oglasi.com</h3>
            <p className="text-xs leading-relaxed text-gray-400">
              Besplatni trans oglasi i osobni kontakti za Balkan.
              100% besplatno objavljivanje.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Države</h4>
            <ul className="space-y-1.5">
              {COUNTRIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}` as never} className="text-xs hover:text-white transition">
                    {c.flag} {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Gradovi</h4>
            <ul className="space-y-1.5">
              {footerCities.map((city) => (
                <li key={city.name}>
                  <Link href={city.path as never} className="text-xs hover:text-white transition">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Info</h4>
            <ul className="space-y-1.5">
              <li><Link href="/oglas/novi" className="text-xs hover:text-white transition">Objavi oglas</Link></li>
              <li><Link href="/login" className="text-xs hover:text-white transition">{t("login")}</Link></li>
              <li><Link href="/registracija" className="text-xs hover:text-white transition">{t("register")}</Link></li>
            </ul>
            <h4 className="text-white font-bold mb-2 mt-4 text-xs uppercase tracking-wider">Kategorije</h4>
            <ul className="space-y-1.5">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/?cat=${cat.slug}` as never} className="text-xs hover:text-white transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-light mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Transice-Oglasi.com. Sva prava pridržana.
          </p>
          <p className="text-[10px] text-gray-500">
            Sav sadržaj na ovoj stranici namijenjen je isključivo osobama starijim od 18 godina.
          </p>
        </div>
      </div>
    </footer>
  );
}
