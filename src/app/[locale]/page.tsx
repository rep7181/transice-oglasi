import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";
import AdCard from "@/components/AdCard";
import SearchFiltersWrapper from "@/components/SearchFiltersWrapper";
import VipAds from "@/components/VipAds";

export const revalidate = 1800; // revalidate every 30 minutes

async function getAds() {
  try {
    // Fetch 10 latest ads per country for a balanced mix
    const countries = await prisma.country.findMany({ select: { id: true } });
    const adsByCountry = await Promise.all(
      countries.map((c) =>
        prisma.ad.findMany({
          where: { status: "ACTIVE", countryId: c.id },
          include: {
            images: { orderBy: { order: "asc" } },
            country: true,
            region: true,
            city: true,
            category: true,
            user: { select: { name: true } },
          },
          orderBy: [{ featured: "desc" }, { premium: "desc" }, { createdAt: "desc" }],
          take: 10,
        })
      )
    );
    // Interleave: round-robin from each country, then shuffle within groups
    const queues = adsByCountry.filter((a) => a.length > 0);
    const mixed: typeof queues[0] = [];
    let round = 0;
    while (mixed.length < 50 && queues.some((q) => q[round])) {
      for (const q of queues) {
        if (q[round] && mixed.length < 50) mixed.push(q[round]);
      }
      round++;
    }
    console.log("[getAds] Found", mixed.length, "ads from", queues.length, "countries");
    return mixed;
  } catch (e) {
    console.error("[getAds] ERROR:", e);
    return [];
  }
}

async function getStats() {
  try {
    const [total, today, users] = await Promise.all([
      prisma.ad.count({ where: { status: "ACTIVE" } }),
      prisma.ad.count({
        where: {
          status: "ACTIVE",
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.user.count(),
    ]);
    return { total, today, users };
  } catch (e) {
    console.error("[getStats] ERROR:", e);
    return { total: 0, today: 0, users: 0 };
  }
}

// Quick-access cities for the city bar
const QUICK_CITIES = [
  "Zagreb", "Split", "Rijeka", "Osijek", "Beograd", "Novi Sad", "Niš",
  "Sarajevo", "Banja Luka", "Podgorica", "Ljubljana", "Skopje",
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [ads, stats] = await Promise.all([getAds(), getStats()]);

  return <HomeContent ads={ads} stats={stats} />;
}

interface Ad {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  age: number | null;
  price: number | null;
  phone: string | null;
  whatsapp: string | null;
  viber: string | null;
  telegram: string | null;
  featured: boolean;
  premium: boolean;
  createdAt: Date;
  views: number;
  images: { url: string }[];
  country: { name: string; slug: string };
  region: { name: string; slug: string } | null;
  city: { name: string; slug: string } | null;
  category: { name: string; slug: string };
}

function HomeContent({ ads, stats }: { ads: Ad[]; stats: { total: number; today: number; users: number } }) {
  const t = useTranslations("hero");
  const th = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <div>
      {/* Hero / Tagline */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl md:text-3xl font-black text-primary mb-2">
            Transice Oglasi
          </h1>
          <p className="text-text-muted text-sm">
            Besplatni trans sex oglasi i upoznavanje — Hrvatska, Srbija, BiH, Crna Gora, Slovenija
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg py-2 px-3 border border-border">
              <div className="text-lg font-bold text-primary">{stats.total}</div>
              <div className="text-[11px] text-text-muted">Oglasa</div>
            </div>
            <div className="bg-white rounded-lg py-2 px-3 border border-border">
              <div className="text-lg font-bold text-accent">{stats.today}</div>
              <div className="text-[11px] text-text-muted">Danas</div>
            </div>
            <div className="bg-white rounded-lg py-2 px-3 border border-border">
              <div className="text-lg font-bold text-success">{stats.users}</div>
              <div className="text-[11px] text-text-muted">Korisnika</div>
            </div>
          </div>
        </div>
      </section>

      {/* Country buttons */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {COUNTRIES.filter((c) => c.slug !== "sjeverna-makedonija").map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}` as never}
                className="inline-flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full border border-primary/20 transition"
              >
                <span>{c.flag}</span>
                {c.name}
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

      {/* Quick city links */}
      <section className="bg-gray-50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="font-medium text-text-muted">Gradovi:</span>
            {QUICK_CITIES.map((city) => (
              <span key={city} className="text-accent hover:underline cursor-pointer">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Post Ad CTA */}
      <section className="bg-gray-100 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-text">Objavi besplatni trans oglas</h2>
            <p className="text-sm text-text-muted">Dodaj slike, kontakt podatke i doseži tisuce posjetitelja</p>
          </div>
          <Link
            href="/oglas/novi"
            className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition whitespace-nowrap"
          >
            + Objavi oglas
          </Link>
        </div>
      </section>

      {/* Ads Masonry Grid */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-primary mb-1">
          Trans oglasi iz cijelog Balkana ({ads.length})
        </h2>
        <p className="text-sm text-text-muted mb-4">
          Sortiraj oglase po državi ili gradu
        </p>

        <VipAds />

        <div className="flex flex-wrap justify-center gap-4 my-4">
          <a href="https://www.eurogirlsescort.com" target="_blank" rel="noopener noreferrer"><img src="https://www.eurogirlsescort.com/dist/images/banners/234X60.jpg" alt="EuroGirlsEscort.com" /></a>
          <a href="https://www.worldescortindex.com/" target="_blank" rel="noopener noreferrer"><img src="https://www.worldescortindex.com/images/our-banners/120x60.jpg" alt="worldescortindex.com" /></a>
        </div>

        {ads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map((ad) => (
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
                images={ad.images.map((i) => i.url)}
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
          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-bold text-lg mb-2">Još nema oglasa</h3>
            <p className="text-text-muted text-sm mb-4">Budi prvi/a koji će objaviti trans oglas!</p>
            <Link
              href="/oglas/novi"
              className="inline-block bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition"
            >
              + Objavi prvi oglas
            </Link>
          </div>
        )}
      </section>

      {/* Country Sections with Regions */}
      <section className="bg-white border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-primary mb-6">Trans oglasi po državama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COUNTRIES.map((country) => (
              <div key={country.slug} className="bg-gray-50 rounded-lg p-5 border border-border">
                <Link href={`/${country.slug}` as never} className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{country.flag}</span>
                  <h3 className="font-bold text-primary hover:text-accent transition">{country.name}</h3>
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {country.regions.slice(0, 6).map((r) => (
                    <Link
                      key={r.slug}
                      href={`/${country.slug}/${r.slug}` as never}
                      className="text-[11px] bg-white text-text-muted hover:text-accent px-2 py-1 rounded border border-border transition"
                    >
                      {r.name}
                    </Link>
                  ))}
                  {country.regions.length > 6 && (
                    <Link
                      href={`/${country.slug}` as never}
                      className="text-[11px] text-accent font-medium px-2 py-1"
                    >
                      +{country.regions.length - 6} više
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Text */}
      <section className="bg-gray-50 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-lg font-bold mb-4">Trans oglasi - besplatni osobni kontakti</h2>
          <div className="text-sm text-text-muted leading-relaxed space-y-3 columns-1 md:columns-2 gap-8">
            <p>
              Transice-Oglasi.com je vodeća platforma za besplatne trans oglase na Balkanu.
              Pokrivamo Hrvatsku, Srbiju, Bosnu i Hercegovinu, Crnu Goru, Sloveniju i Sjevernu Makedoniju.
              Objavi svoj oglas potpuno besplatno i doseži tisuće posjetitelja dnevno.
            </p>
            <p>
              Na našoj stranici možete pronaći trans escort oglase, masaže, upoznavanja, webcam i druge usluge.
              Svi oglasi su sortirani po državama, regijama i gradovima za lakše pretraživanje.
              Dodajte slike, kontakt podatke i vaš oglas će biti vidljiv odmah.
            </p>
            <p>
              Kategorije uključuju: Escort, Trans sex, Oralno, Masaža, Upoznavanje, Webcam, Telefon i više.
              Registracija je brza i besplatna. Vaši podaci su sigurni i zaštićeni.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
