import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import AdCard from "@/components/AdCard";
import CountryGrid from "@/components/CountryGrid";
import SearchFiltersWrapper from "@/components/SearchFiltersWrapper";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";

const DEMO_ADS = [
  {
    id: "1", slug: "lena-zagreb-escort", title: "Lena - Zagreb, dostupna sada",
    age: 25, price: 100, city: "Zagreb", region: "Grad Zagreb",
    country: "Hrvatska", countrySlug: "hrvatska", category: "Escort",
    imageUrl: "/uploads/demo/demo1.jpg", featured: true, premium: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), views: 234,
  },
  {
    id: "2", slug: "mia-beograd", title: "Mia - Beograd centar",
    age: 23, price: 80, city: "Beograd", region: "Beograd",
    country: "Srbija", countrySlug: "srbija", category: "Escort",
    imageUrl: "/uploads/demo/demo2.jpg", featured: false, premium: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(), views: 189,
  },
  {
    id: "3", slug: "sara-split-masaza", title: "Sara - Split, profesionalna masaža",
    age: 28, price: 60, city: "Split", region: "Splitsko-dalmatinska",
    country: "Hrvatska", countrySlug: "hrvatska", category: "Masaža",
    imageUrl: "/uploads/demo/demo3.jpg", featured: false, premium: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(), views: 95,
  },
  {
    id: "4", slug: "nina-sarajevo", title: "Nina - Sarajevo, nova u gradu",
    age: 22, price: 70, city: "Sarajevo", region: "Kanton Sarajevo",
    country: "Bosna i Hercegovina", countrySlug: "bosna-i-hercegovina", category: "Escort",
    imageUrl: "/uploads/demo/demo4.jpg", featured: false, premium: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(), views: 67,
  },
  {
    id: "5", slug: "ana-novi-sad", title: "Ana - Novi Sad, provjeren profil",
    age: 26, price: 90, city: "Novi Sad", region: "Vojvodina",
    country: "Srbija", countrySlug: "srbija", category: "Escort",
    imageUrl: "/uploads/demo/demo5.jpg", featured: true, premium: false,
    createdAt: new Date(Date.now() - 43200000).toISOString(), views: 312,
  },
  {
    id: "6", slug: "maja-budva-webcam", title: "Maja - Budva, webcam show",
    age: 24, price: 30, city: "Budva", region: "Primorje",
    country: "Crna Gora", countrySlug: "crna-gora", category: "Webcam",
    imageUrl: "/uploads/demo/demo6.jpg", featured: false, premium: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(), views: 156,
  },
];

const COUNTRY_COUNTS = COUNTRIES.map((c) => ({
  name: c.name, slug: c.slug, flag: c.flag,
  adCount: Math.floor(Math.random() * 50) + 5,
}));

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("hero");
  const th = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("title")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/oglas/novi"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
            >
              {t("postFree")}
            </Link>
            <a
              href="#oglasi"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
            >
              {t("browseAds")}
            </a>
          </div>
        </div>
      </section>

      {/* Country Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-4">{th("chooseCountry")}</h2>
        <CountryGrid countries={COUNTRY_COUNTS} />
      </section>

      {/* Latest Ads */}
      <section id="oglasi" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{th("latestAds")}</h2>
          <span className="text-sm text-text-light">
            {DEMO_ADS.length} {tc("ads")}
          </span>
        </div>

        <SearchFiltersWrapper categories={CATEGORIES} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {DEMO_ADS.map((ad) => (
            <AdCard key={ad.id} {...ad} />
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-white border border-border hover:border-primary text-text hover:text-primary px-8 py-3 rounded-lg font-medium transition">
            {tc("loadMore")}
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-center mb-10">{th("howItWorksTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="font-semibold text-lg mb-2">{th("howStep1Title")}</h3>
              <p className="text-text-light text-sm">{th("howStep1Text")}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="font-semibold text-lg mb-2">{th("howStep2Title")}</h3>
              <p className="text-text-light text-sm">{th("howStep2Text")}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="font-semibold text-lg mb-2">{th("howStep3Title")}</h3>
              <p className="text-text-light text-sm">{th("howStep3Text")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-center mb-10">{th("whyUsTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold mb-2">{th("whyUs1Title")}</h3>
              <p className="text-text-light text-sm">{th("whyUs1Text")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold mb-2">{th("whyUs2Title")}</h3>
              <p className="text-text-light text-sm">{th("whyUs2Text")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">{th("whyUs3Title")}</h3>
              <p className="text-text-light text-sm">{th("whyUs3Text")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-3xl mb-3">🗣️</div>
              <h3 className="font-semibold mb-2">{th("whyUs4Title")}</h3>
              <p className="text-text-light text-sm">{th("whyUs4Text")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-center mb-10">{th("faqTitle")}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <details key={i} className="bg-white rounded-lg border border-border group">
                <summary className="cursor-pointer px-6 py-4 font-medium flex items-center justify-between">
                  {th(`faq${i}Q`)}
                  <svg className="w-5 h-5 text-text-light group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-text-light text-sm">
                  {th(`faq${i}A`)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Text - Main */}
      <section className="bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold mb-4">{th("seoTitle")}</h2>
          <div className="text-sm text-text-light max-w-none columns-1 md:columns-2 gap-8 space-y-4">
            <p>{th("seoText1")}</p>
            <p>{th("seoText2")}</p>
            <p>{th("seoText3")}</p>
          </div>
        </div>
      </section>

      {/* SEO Text - Per Country */}
      <section className="bg-gray-50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold mb-6">{th("countrySeoTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: "hrvatska", flag: "🇭🇷", name: "Hrvatska" },
              { key: "srbija", flag: "🇷🇸", name: "Srbija" },
              { key: "bih", flag: "🇧🇦", name: "Bosna i Hercegovina" },
              { key: "cg", flag: "🇲🇪", name: "Crna Gora" },
              { key: "mk", flag: "🇲🇰", name: "Sjeverna Makedonija" },
              { key: "si", flag: "🇸🇮", name: "Slovenija" },
            ].map((country) => (
              <div key={country.key} className="bg-white rounded-lg p-5 border border-border">
                <h3 className="font-semibold mb-2">
                  <span className="mr-2">{country.flag}</span>
                  {country.name}
                </h3>
                <p className="text-sm text-text-light">{th(`countrySeo_${country.key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
