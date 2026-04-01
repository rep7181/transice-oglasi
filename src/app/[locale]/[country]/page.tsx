import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";
import Breadcrumb from "@/components/Breadcrumb";
import SearchFiltersWrapper from "@/components/SearchFiltersWrapper";
import AdCard from "@/components/AdCard";
import VipAds from "@/components/VipAds";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: string; country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) return {};

  return {
    title: `Trans oglasi ${country.name} - Escort, trans sex, upoznavanje`,
    description: `Besplatni trans oglasi u ${country.name}. Trans escort, masaža, upoznavanje, webcam i telefon kontakti. Objavi oglas besplatno!`,
  };
}

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

async function getCountryAds(countrySlug: string) {
  try {
    return await prisma.ad.findMany({
      where: { status: "ACTIVE", country: { slug: countrySlug } },
      include: {
        images: { orderBy: { order: "asc" } },
        country: true,
        region: true,
        city: true,
        category: true,
      },
      orderBy: [{ featured: "desc" }, { premium: "desc" }, { createdAt: "desc" }],
      take: 50,
    });
  } catch {
    return [];
  }
}

export default async function CountryPage({ params }: Props) {
  const { locale, country: slug } = await params;
  setRequestLocale(locale);

  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) notFound();

  const ads = await getCountryAds(slug);

  return (
    <div>
      {/* Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: country.name }]} />
          <h1 className="text-2xl font-bold text-primary mt-2">
            {country.flag} Trans oglasi - {country.name}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Besplatni trans oglasi i kontakti u {country.name}
          </p>
          <div className="mt-2">
          </div>
        </div>
      </section>

      {/* Regions & Cities (collapsible) */}
      <section className="bg-gray-50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <details>
            <summary className="text-sm font-bold text-primary cursor-pointer select-none hover:text-accent transition">
              Regije i gradovi ({country.regions.length})
            </summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {country.regions.map((region) => (
                <div key={region.slug} className="bg-white rounded-lg border border-border p-3">
                  <Link
                    href={`/${country.slug}/${region.slug}`}
                    className="font-bold text-sm text-primary hover:text-accent transition block mb-1.5"
                  >
                    {region.name}
                  </Link>
                  <div className="flex flex-wrap gap-1">
                    {region.cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${country.slug}/${region.slug}/${city.slug}`}
                        className="text-[11px] text-text-muted hover:text-accent bg-gray-50 px-1.5 py-0.5 rounded transition"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <SearchFiltersWrapper categories={CATEGORIES} />
        </div>
      </section>

      {/* Ads */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-primary mb-4">
          Oglasi u {country.name} ({ads.length})
        </h2>

        <VipAds />

        {ads.length > 0 ? (
          <div className="columns-1 md:columns-2 gap-4">
            {ads.map((ad: any) => (
              <AdCard
                key={ad.id}
                id={ad.id}
                slug={ad.slug}
                title={ad.title}
                description={ad.description}
                age={ad.age}
                price={ad.price}
                city={ad.city?.name}
                citySlug={ad.city?.slug}
                region={ad.region?.name}
                regionSlug={ad.region?.slug}
                country={ad.country.name}
                countrySlug={ad.country.slug}
                category={ad.category.name}
                categorySlug={ad.category.slug}
                imageUrl={ad.images[0]?.url}
                images={ad.images.map((i: any) => i.url)}
                featured={ad.featured}
                premium={ad.premium}
                createdAt={ad.createdAt.toISOString()}
                views={ad.views}
                phone={ad.phone}
                whatsapp={ad.whatsapp}
                viber={ad.viber}
                telegram={ad.telegram}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-border p-10 text-center">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-bold mb-1">Još nema oglasa u {country.name}</h3>
            <p className="text-sm text-text-muted mb-3">Budi prvi/a koji će objaviti trans oglas!</p>
            <Link
              href="/oglas/novi"
              className="inline-block bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-bold text-sm transition"
            >
              + Objavi oglas
            </Link>
          </div>
        )}
      </section>

      {/* SEO */}
      <section className="bg-gray-50 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="font-bold mb-3">Trans oglasi {country.name}</h2>
          <p className="text-sm text-text-muted leading-relaxed mb-4">
            Pregledajte sve trans oglase u {country.name}. Besplatno objavi oglas ili kontaktiraj
            oglašivače putem WhatsApp, Viber ili Telegram. Pokrivamo sve regije i gradove.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {country.regions.flatMap((r) =>
              r.cities.slice(0, 3).map((city) => (
                <Link
                  key={city.slug}
                  href={`/${country.slug}/${r.slug}/${city.slug}`}
                  className="text-[11px] text-accent bg-accent/5 px-2 py-1 rounded hover:bg-accent/10 transition"
                >
                  Trans oglasi {city.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
