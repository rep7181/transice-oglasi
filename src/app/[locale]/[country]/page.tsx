import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";
import Breadcrumb from "@/components/Breadcrumb";
import SearchFiltersWrapper from "@/components/SearchFiltersWrapper";

interface Props {
  params: Promise<{ locale: string; country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) return {};

  return {
    title: `Trans oglasi ${country.name} - Transice oglasi`,
    description: `Trans oglase u ${country.name}. Escort, masaža, upoznavanje. Besplatno postavljanje oglasa.`,
  };
}

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

export default async function CountryPage({ params }: Props) {
  const { locale, country: slug } = await params;
  setRequestLocale(locale);

  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) notFound();

  const t = await getTranslations("country");
  const tc = await getTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: country.name }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {country.flag} {t("transAds")} - {country.name}
        </h1>
        <p className="text-text-light">
          {t("browseAll", { country: country.name })}
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">{t("regionsAndCities")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {country.regions.map((region) => (
            <div key={region.slug} className="bg-white rounded-xl border border-border p-4 hover:shadow-sm transition">
              <Link href={`/${country.slug}/${region.slug}`} className="font-semibold text-sm hover:text-primary transition block mb-2">
                {region.name}
              </Link>
              <div className="flex flex-wrap gap-2">
                {region.cities.map((city) => (
                  <Link key={city.slug} href={`/${country.slug}/${region.slug}/${city.slug}`} className="text-xs text-text-light hover:text-primary bg-surface-alt px-2 py-1 rounded transition">
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">{t("allAdsIn", { country: country.name })}</h2>
        <SearchFiltersWrapper categories={CATEGORIES} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="col-span-full text-center py-12 text-text-light">
          <p className="text-lg mb-2">{tc("noAds")} - {country.name}</p>
          <Link href="/oglas/novi" className="text-primary hover:text-primary-dark font-medium">
            {tc("beFirst")}
          </Link>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-3">{t("transAds")} {country.name}</h2>
        <p className="text-sm text-text-light leading-relaxed">
          {t("seoText", { country: country.name })}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {country.regions.flatMap((r) =>
            r.cities.map((city) => (
              <Link key={city.slug} href={`/${country.slug}/${r.slug}/${city.slug}`} className="text-xs text-primary hover:text-primary-dark bg-primary/5 px-2 py-1 rounded">
                {t("transAds")} {city.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
