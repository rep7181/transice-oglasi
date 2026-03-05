import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";
import Breadcrumb from "@/components/Breadcrumb";
import SearchFiltersWrapper from "@/components/SearchFiltersWrapper";
import AdCard from "@/components/AdCard";
import AffiliateLink from "@/components/AffiliateLink";

interface Props {
  params: Promise<{ locale: string; country: string; region: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: cs, region: rs } = await params;
  const country = COUNTRIES.find((c) => c.slug === cs);
  const region = country?.regions.find((r) => r.slug === rs);
  if (!country || !region) return {};

  return {
    title: `Trans oglasi ${region.name}, ${country.name} - Transice-Oglasi.com`,
    description: `Trans oglasi u regiji ${region.name}, ${country.name}. Gradovi: ${region.cities.map((c) => c.name).join(", ")}.`,
  };
}

export function generateStaticParams() {
  return [];
}

async function getRegionAds(regionSlug: string) {
  try {
    return await prisma.ad.findMany({
      where: { status: "ACTIVE", region: { slug: regionSlug } },
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

export default async function RegionPage({ params }: Props) {
  const { locale, country: cs, region: rs } = await params;
  setRequestLocale(locale);
  const country = COUNTRIES.find((c) => c.slug === cs);
  const region = country?.regions.find((r) => r.slug === rs);

  if (!country || !region) notFound();

  const ads = await getRegionAds(rs);

  return (
    <div>
      {/* Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { label: country.name, href: `/${country.slug}` },
              { label: region.name },
            ]}
          />
          <h1 className="text-2xl font-bold text-primary mt-2">
            Trans oglasi - {region.name}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {country.flag} {country.name} &rsaquo; {region.name}
          </p>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-gray-50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {region.cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${country.slug}/${region.slug}/${city.slug}`}
                className="bg-white border border-border hover:border-accent text-sm px-3 py-1.5 rounded-full text-text hover:text-accent transition"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <SearchFiltersWrapper categories={CATEGORIES} />
        </div>
      </section>

      {/* Affiliate */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <AffiliateLink location={region.name} />
      </section>

      {/* Ads */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-primary mb-4">
          Oglasi u {region.name} ({ads.length})
        </h2>

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
                region={ad.region?.name}
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
            <h3 className="font-bold mb-1">Još nema oglasa u {region.name}</h3>
            <p className="text-sm text-text-muted mb-3">Budi prvi/a!</p>
            <Link
              href="/oglas/novi"
              className="inline-block bg-success hover:bg-success-dark text-white px-5 py-2 rounded-lg font-bold text-sm transition"
            >
              + Objavi oglas
            </Link>
          </div>
        )}
      </section>

      {/* SEO */}
      <section className="bg-gray-50 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="font-bold mb-2">Trans oglasi {region.name}</h2>
          <p className="text-sm text-text-muted">
            Pregledajte trans oglase u regiji {region.name}, {country.name}.
            Dostupni gradovi: {region.cities.map((c) => c.name).join(", ")}.
          </p>
        </div>
      </section>
    </div>
  );
}
