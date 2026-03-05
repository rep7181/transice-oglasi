import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import VoteButtons from "@/components/VoteButtons";

// This would come from the database in production
const DEMO_AD = {
  id: "1",
  title: "Lena - Zagreb, dostupna sada",
  slug: "lena-zagreb-escort",
  description: `Pozdrav, ja sam Lena. Imam 25 godina i nalazim se u centru Zagreba.

Nudim kvalitetnu uslugu u diskretnom okruženju. Provjeren profil.

Dostupna sam svaki dan od 10h do 22h. Za više informacija kontaktirajte me putem WhatsApp ili Vibera.

Molim vas, samo ozbiljne poruke.`,
  age: 25,
  price: 100,
  phone: "+385 91 234 5678",
  whatsapp: "+385 91 234 5678",
  viber: "+385 91 234 5678",
  telegram: "@lena_zg",
  views: 234,
  likes: 0,
  dislikes: 0,
  createdAt: "2026-02-27T10:00:00Z",
  country: { name: "Hrvatska", slug: "hrvatska", flag: "\ud83c\udded\ud83c\uddf7" },
  region: { name: "Grad Zagreb", slug: "grad-zagreb" },
  city: { name: "Zagreb", slug: "zagreb" },
  category: { name: "Escort", slug: "escort" },
  user: { name: "Lena", createdAt: "2026-01-15T00:00:00Z" },
  images: [
    { url: "/uploads/demo/demo1.jpg", id: "img1" },
    { url: "/uploads/demo/demo2.jpg", id: "img2" },
    { url: "/uploads/demo/demo3.jpg", id: "img3" },
    { url: "/uploads/demo/demo4.jpg", id: "img4" },
  ],
};

export function generateMetadata(): Metadata {
  return {
    title: `${DEMO_AD.title} - TransOglasi`,
    description: DEMO_AD.description.slice(0, 160),
  };
}

export default function AdDetailPage() {
  const ad = DEMO_AD;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: ad.country.name, href: `/${ad.country.slug}` },
          {
            label: ad.region.name,
            href: `/${ad.country.slug}/${ad.region.slug}`,
          },
          { label: ad.city.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Images & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <ImageGallery images={ad.images} title={ad.title} />

          {/* Description */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h1 className="text-2xl font-bold mb-2">{ad.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-light mb-4">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                {ad.category.name}
              </span>
              <span>
                {ad.country.flag} {ad.city.name}, {ad.country.name}
              </span>
              {ad.age && <span>{ad.age} godina</span>}
              <span>{ad.views} pregleda</span>
            </div>

            <div className="border-t border-border pt-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {ad.description}
              </p>
            </div>

            {/* Like / Dislike */}
            <div className="border-t border-border pt-4">
              <VoteButtons adId={ad.id} initialLikes={ad.likes} initialDislikes={ad.dislikes} />
            </div>
          </div>
        </div>

        {/* Right - Contact & Info */}
        <div className="space-y-4">
          {/* Price */}
          <div className="bg-white rounded-xl border border-border p-6 text-center">
            {ad.price ? (
              <div>
                <span className="text-3xl font-bold text-primary">
                  {ad.price} &euro;
                </span>
              </div>
            ) : (
              <span className="text-lg text-text-light">Po dogovoru</span>
            )}
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl border border-border p-6 space-y-3">
            <h3 className="font-semibold">Kontakt</h3>

            {ad.phone && (
              <a
                href={`tel:${ad.phone}`}
                className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-text rounded-lg px-4 py-3 transition text-sm font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {ad.phone}
              </a>
            )}

            {ad.whatsapp && (
              <a
                href={`https://wa.me/${ad.whatsapp.replace(/[^0-9+]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-3 transition text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            )}

            {ad.viber && (
              <a
                href={`viber://chat?number=${ad.viber.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-3 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 transition text-sm font-medium"
              >
                <span className="w-5 h-5 flex items-center justify-center font-bold text-xs">V</span>
                Viber
              </a>
            )}

            {ad.telegram && (
              <a
                href={`https://t.me/${ad.telegram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-3 transition text-sm font-medium"
              >
                <span className="w-5 h-5 flex items-center justify-center font-bold text-xs">T</span>
                Telegram
              </a>
            )}
          </div>

          {/* Advertiser info */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-3">Oglašivač</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {ad.user.name[0]}
              </div>
              <div>
                <p className="font-medium text-sm">{ad.user.name}</p>
                <p className="text-xs text-text-light">
                  Član od{" "}
                  {new Date(ad.user.createdAt).toLocaleDateString("hr-HR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Report */}
          <button className="w-full text-center text-sm text-text-light hover:text-red-500 transition py-2">
            Prijavi oglas
          </button>
        </div>
      </div>

      {/* Related - SEO links */}
      <div className="mt-12 bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Više oglasa</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${ad.country.slug}`}
            className="text-sm text-primary hover:text-primary-dark bg-primary/5 px-3 py-1.5 rounded-full"
          >
            Trans oglasi {ad.country.name}
          </Link>
          <Link
            href={`/${ad.country.slug}/${ad.region.slug}`}
            className="text-sm text-primary hover:text-primary-dark bg-primary/5 px-3 py-1.5 rounded-full"
          >
            Trans oglasi {ad.region.name}
          </Link>
          <Link
            href={`/?cat=${ad.category.slug}`}
            className="text-sm text-primary hover:text-primary-dark bg-primary/5 px-3 py-1.5 rounded-full"
          >
            {ad.category.name} oglasi
          </Link>
        </div>
      </div>
    </div>
  );
}
