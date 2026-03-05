import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import VoteButtons from "@/components/VoteButtons";
import AffiliateLink from "@/components/AffiliateLink";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

async function getAd(slug: string) {
  try {
    const ad = await prisma.ad.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        country: true,
        region: true,
        city: true,
        category: true,
        user: { select: { name: true, createdAt: true } },
      },
    });

    if (ad) {
      // Increment view count (fire and forget)
      prisma.ad.update({
        where: { id: ad.id },
        data: { views: { increment: 1 } },
      }).catch(() => {});
    }

    return ad;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAd(id);
  if (!ad) return {};

  return {
    title: `${ad.title} - Transice-Oglasi.com`,
    description: ad.description?.slice(0, 160) || `Trans oglas: ${ad.title}`,
  };
}

export default async function AdDetailPage({ params }: Props) {
  const { id } = await params;
  const ad = await getAd(id);

  if (!ad) notFound();

  return (
    <div>
      {/* Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { label: ad.country.name, href: `/${ad.country.slug}` },
              ...(ad.region ? [{ label: ad.region.name, href: `/${ad.country.slug}/${ad.region.slug}` }] : []),
              ...(ad.city ? [{ label: ad.city.name }] : []),
            ]}
          />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Images & Description */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image gallery */}
            <ImageGallery images={ad.images} title={ad.title} />

            {/* Title & Meta */}
            <div className="bg-white rounded-lg border border-border p-5">
              <h1 className="text-xl font-bold text-primary mb-2">{ad.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-4">
                <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                  {ad.category.name}
                </span>
                <span className="bg-info/10 text-info px-2 py-0.5 rounded-full">
                  {ad.city?.name || ad.region?.name || ad.country.name}
                </span>
                {ad.age && (
                  <span className="bg-gray-100 text-text-muted px-2 py-0.5 rounded-full">
                    {ad.age} god.
                  </span>
                )}
                <span className="bg-gray-100 text-text-muted px-2 py-0.5 rounded-full">
                  {ad.views} pregleda
                </span>
                <AffiliateLink location={ad.city?.name || ad.region?.name || ad.country.name} variant="chip" />
              </div>

              {ad.description && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-text">
                    {ad.description}
                  </p>
                </div>
              )}

              {/* Like / Dislike */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <VoteButtons adId={ad.id} initialLikes={ad.likes} initialDislikes={ad.dislikes} />
              </div>

            </div>
          </div>

          {/* Right - Contact & Info */}
          <div className="space-y-4">
            {/* Price */}
            {ad.price && (
              <div className="bg-white rounded-lg border border-border p-5 text-center">
                <span className="text-2xl font-bold text-accent">{ad.price} &euro;</span>
              </div>
            )}

            {/* Contact */}
            <div className="bg-white rounded-lg border border-border p-5 space-y-2.5">
              <h3 className="font-bold text-sm text-primary">Kontakt</h3>

              {ad.phone && (
                <a
                  href={`tel:${ad.phone}`}
                  className="flex items-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-text rounded-lg px-4 py-2.5 transition text-sm font-medium"
                >
                  📞 {ad.phone}
                </a>
              )}

              {ad.whatsapp && (
                <a
                  href={`https://wa.me/${ad.whatsapp.replace(/[^0-9+]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg px-4 py-2.5 transition text-sm font-medium"
                >
                  💬 WhatsApp
                </a>
              )}

              {ad.viber && (
                <a
                  href={`viber://chat?number=${ad.viber.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2 w-full bg-gray-600 hover:bg-gray-700 text-white rounded-lg px-4 py-2.5 transition text-sm font-medium"
                >
                  📱 Viber
                </a>
              )}

              {ad.telegram && (
                <a
                  href={`https://t.me/${ad.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2.5 transition text-sm font-medium"
                >
                  ✈️ Telegram
                </a>
              )}
            </div>

            {/* Advertiser */}
            <div className="bg-white rounded-lg border border-border p-5">
              <h3 className="font-bold text-sm text-primary mb-3">Oglašivač</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {ad.user.name[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{ad.user.name}</p>
                  <p className="text-[11px] text-text-muted">
                    Član od{" "}
                    {new Date(ad.user.createdAt).toLocaleDateString("hr-HR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full text-center text-xs text-text-muted hover:text-accent transition py-2">
              Prijavi oglas
            </button>

          </div>
        </div>

        {/* Related links */}
        <div className="mt-8 bg-white rounded-lg border border-border p-5">
          <h2 className="font-bold text-sm text-primary mb-3">Više oglasa</h2>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href={`/${ad.country.slug}`}
              className="text-xs text-accent bg-accent/5 px-2.5 py-1 rounded-full hover:bg-accent/10 transition"
            >
              Trans oglasi {ad.country.name}
            </Link>
            {ad.region && (
              <Link
                href={`/${ad.country.slug}/${ad.region.slug}`}
                className="text-xs text-accent bg-accent/5 px-2.5 py-1 rounded-full hover:bg-accent/10 transition"
              >
                Trans oglasi {ad.region.name}
              </Link>
            )}
            <Link
              href={`/?cat=${ad.category.slug}`}
              className="text-xs text-accent bg-accent/5 px-2.5 py-1 rounded-full hover:bg-accent/10 transition"
            >
              {ad.category.name} oglasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
