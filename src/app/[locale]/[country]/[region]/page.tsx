import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";
import Breadcrumb from "@/components/Breadcrumb";
import SearchFiltersWrapper from "@/components/SearchFiltersWrapper";

interface Props {
  params: Promise<{ locale: string; country: string; region: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: cs, region: rs } = await params;
  const country = COUNTRIES.find((c) => c.slug === cs);
  const region = country?.regions.find((r) => r.slug === rs);
  if (!country || !region) return {};

  return {
    title: `Trans oglasi ${region.name}, ${country.name}`,
    description: `Trans oglasi u regiji ${region.name}, ${country.name}. Escort, masaža i upoznavanje u gradovima: ${region.cities.map((c) => c.name).join(", ")}.`,
  };
}

export function generateStaticParams() {
  const params: { country: string; region: string }[] = [];
  COUNTRIES.forEach((c) => {
    c.regions.forEach((r) => {
      params.push({ country: c.slug, region: r.slug });
    });
  });
  return params;
}

export default async function RegionPage({ params }: Props) {
  const { locale, country: cs, region: rs } = await params;
  setRequestLocale(locale);
  const country = COUNTRIES.find((c) => c.slug === cs);
  const region = country?.regions.find((r) => r.slug === rs);

  if (!country || !region) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: country.name, href: `/${country.slug}` },
          { label: region.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Trans oglasi - {region.name}
        </h1>
        <p className="text-text-light">
          {country.flag} {country.name} &rsaquo; {region.name}
        </p>
      </div>

      {/* Cities */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Gradovi</h2>
        <div className="flex flex-wrap gap-3">
          {region.cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${country.slug}/${region.slug}/${city.slug}`}
              className="bg-white rounded-lg border border-border hover:border-primary px-4 py-2.5 text-sm font-medium hover:text-primary transition"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </div>

      <SearchFiltersWrapper categories={CATEGORIES} />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="col-span-full text-center py-12 text-text-light">
          <p className="text-lg mb-2">
            Još nema oglasa u {region.name}
          </p>
          <Link
            href="/oglas/novi"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Budi prvi - postavi oglas!
          </Link>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-3">
          Trans oglasi {region.name}
        </h2>
        <p className="text-sm text-text-light">
          Pregledajte trans oglase u regiji {region.name}, {country.name}.
          Dostupni gradovi:{" "}
          {region.cities.map((c) => c.name).join(", ")}.
        </p>
      </div>
    </div>
  );
}
