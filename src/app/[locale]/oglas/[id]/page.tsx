import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import VoteButtons from "@/components/VoteButtons";
import Comments from "@/components/Comments";

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
      },
    });

    if (ad) {
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
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { label: ad.country.name, href: `/${ad.country.slug}` },
              ...(ad.region ? [{ label: ad.region.name, href: `/${ad.country.slug}/${ad.region.slug}` }] : []),
              ...(ad.city ? [{ label: ad.city.name }] : []),
            ]}
          />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Image gallery */}
        {ad.images.length > 0 && <ImageGallery images={ad.images} title={ad.title} />}

        {/* Ad content */}
        <div className="bg-white rounded-lg border border-border p-5">
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

        {/* Comments */}
        <Comments adId={ad.id} />

        {/* Report */}
        <div className="text-center">
          <button className="text-xs text-text-muted hover:text-accent transition py-2">
            Prijavi oglas
          </button>
        </div>

        {/* Related links */}
        <div className="bg-white rounded-lg border border-border p-5">
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
