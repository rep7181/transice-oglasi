import { Link } from "@/i18n/navigation";

interface AdCardProps {
  id: string;
  slug: string;
  title: string;
  age?: number | null;
  price?: number | null;
  city?: string | null;
  region?: string | null;
  country: string;
  countrySlug: string;
  category: string;
  imageUrl?: string | null;
  featured?: boolean;
  premium?: boolean;
  createdAt: string;
  views: number;
}

export default function AdCard({
  slug,
  title,
  age,
  price,
  city,
  country,
  countrySlug,
  category,
  imageUrl,
  featured,
  premium,
  createdAt,
  views,
}: AdCardProps) {
  const timeAgo = getTimeAgo(new Date(createdAt));

  return (
    <Link href={`/oglas/${slug}`} className="block group">
      <div
        className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
          featured
            ? "ring-2 ring-accent"
            : premium
              ? "ring-2 ring-primary"
              : "border border-border"
        }`}
      >
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {(featured || premium) && (
            <div className="absolute top-2 left-2">
              {featured && (
                <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                  TOP
                </span>
              )}
              {premium && !featured && (
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                  VIP
                </span>
              )}
            </div>
          )}

          <div className="absolute top-2 right-2">
            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
              {category}
            </span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm text-text truncate group-hover:text-primary transition">
            {title}
          </h3>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-text-light">
            <span>{city || country}</span>
            {age && (
              <>
                <span>·</span>
                <span>{age} god.</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            {price ? (
              <span className="text-primary font-bold text-sm">
                {price} &euro;
              </span>
            ) : (
              <span className="text-text-light text-xs">Po dogovoru</span>
            )}
            <div className="flex items-center gap-2 text-xs text-text-light">
              <span>{views} pregleda</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "sada";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}s`;
}
