import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";
import Breadcrumb from "@/components/Breadcrumb";
import SearchFiltersWrapper from "@/components/SearchFiltersWrapper";

interface Props {
  params: Promise<{ locale: string; country: string; region: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: cs, region: rs, city: cis } = await params;
  const country = COUNTRIES.find((c) => c.slug === cs);
  const region = country?.regions.find((r) => r.slug === rs);
  const city = region?.cities.find((c) => c.slug === cis);
  if (!country || !region || !city) return {};

  return {
    title: `Trans oglasi ${city.name} - Transice oglasi ${city.name}, ${country.name}`,
    description: `Najnoviji trans oglasi u ${city.name}, ${country.name}. Escort, masaža, upoznavanje. Besplatno postavi oglas u ${city.name}.`,
  };
}

export function generateStaticParams() {
  return [];
}

export default async function CityPage({ params }: Props) {
  const { locale, country: cs, region: rs, city: cis } = await params;
  setRequestLocale(locale);
  const country = COUNTRIES.find((c) => c.slug === cs);
  const region = country?.regions.find((r) => r.slug === rs);
  const city = region?.cities.find((c) => c.slug === cis);

  if (!country || !region || !city) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: country.name, href: `/${country.slug}` },
          {
            label: region.name,
            href: `/${country.slug}/${region.slug}`,
          },
          { label: city.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Trans oglasi {city.name}
        </h1>
        <p className="text-text-light">
          {country.flag} {country.name} &rsaquo; {region.name} &rsaquo;{" "}
          {city.name}
        </p>
      </div>

      <SearchFiltersWrapper categories={CATEGORIES} />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="col-span-full text-center py-12 text-text-light">
          <p className="text-lg mb-2">
            Još nema oglasa u {city.name}
          </p>
          <Link
            href="/oglas/novi"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Budi prvi - postavi oglas u {city.name}!
          </Link>
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-12 bg-white rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold">
          Transice oglasi {city.name}
        </h2>
        <p className="text-sm text-text-light leading-relaxed">
          Tražite transice oglase u {city.name}? Na TransOglasi portalu možete
          besplatno pregledati ili postaviti oglas u {city.name},{" "}
          {country.name}. Naša platforma nudi razne kategorije uključujući
          escort, masažu, upoznavanje, webcam i telefon usluge.
        </p>
        <p className="text-sm text-text-light leading-relaxed">
          Svi oglasi u {city.name} prolaze kroz moderaciju kako bismo
          osigurali kvalitetan sadržaj. Kontaktirajte oglašivače putem
          WhatsApp, Viber ili Telegram aplikacija.
        </p>

        <div className="border-t border-border pt-4">
          <h3 className="font-medium text-sm mb-2">Povezane pretrage</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${country.slug}/${region.slug}/${city.slug}?cat=${cat.slug}`}
                className="text-xs text-primary bg-primary/5 px-2 py-1 rounded hover:bg-primary/10 transition"
              >
                {cat.name} {city.name}
              </Link>
            ))}
            <Link
              href={`/${country.slug}`}
              className="text-xs text-primary bg-primary/5 px-2 py-1 rounded hover:bg-primary/10 transition"
            >
              Trans oglasi {country.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
