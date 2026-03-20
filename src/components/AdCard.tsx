"use client";

import { Link } from "@/i18n/navigation";
import { useState } from "react";

interface AdCardProps {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  age?: number | null;
  price?: number | null;
  city?: string | null;
  region?: string | null;
  country: string;
  countrySlug: string;
  category: string;
  categorySlug?: string;
  imageUrl?: string | null;
  images?: string[];
  featured?: boolean;
  premium?: boolean;
  createdAt: string;
  views: number;
  phone?: string | null;
  whatsapp?: string | null;
  viber?: string | null;
  telegram?: string | null;
}

export default function AdCard({
  slug,
  title,
  description,
  age,
  price,
  city,
  region,
  country,
  category,
  categorySlug,
  imageUrl,
  images,
  featured,
  premium,
  createdAt,
  views,
  phone,
  whatsapp,
  viber,
  telegram,
}: AdCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const timeAgo = getTimeAgo(new Date(createdAt));
  const allImages = images?.length ? images : imageUrl ? [imageUrl] : [];
  const hasContact = phone || whatsapp || viber || telegram;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm break-inside-avoid mb-4 overflow-hidden ${
        featured ? "border-2 border-black" : premium ? "border-2 border-gray-400" : "border border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          {featured && (
            <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">TOP</span>
          )}
          {premium && !featured && (
            <span className="bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">VIP</span>
          )}
          {age && <span className="text-xs text-text-muted">({age} god.)</span>}
        </div>
        <span className="text-[11px] text-text-muted">{timeAgo}</span>
      </div>

      {/* Metadata */}
      <div className="px-4 py-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted border-b border-gray-100">
        <span className="inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
          {category}
        </span>
        {region && <span>{region}</span>}
        {city && <span className="font-medium text-text">{city}</span>}
        {price && <span className="font-bold text-primary">{price}&euro;</span>}
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-2.5">
          <p className={`text-sm text-text leading-relaxed ${!expanded ? "line-clamp-3" : ""}`}>
            {description}
          </p>
          {description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-gray-500 hover:text-black hover:underline mt-1"
            >
              {expanded ? "Sakrij" : "Prikaži više..."}
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {categorySlug && (
          <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
            {category}
          </span>
        )}
        {city && (
          <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
            {city}
          </span>
        )}
        {country && (
          <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
            {country}
          </span>
        )}
      </div>

      {/* Contact & Actions */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {phone && (
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener"
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-medium transition"
            >
              💬 WhatsApp
            </a>
          )}
          <Link
            href={`/oglas/${slug}`}
            className="text-xs bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded font-medium transition"
          >
            Detalji
          </Link>
        </div>
        <span className="text-[11px] text-text-muted">{views} pregleda</span>
      </div>

      {/* Legacy contact info - hidden */}
      {false && hasContact && (
        <div className="px-4 py-3 border-t border-gray-200 space-y-2 bg-gray-50">
          {phone && (
            <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-text hover:underline">
              <span>💬</span> WhatsApp: {phone}
            </a>
          )}
          {whatsapp && (
            <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-text hover:underline">
              <span>💬</span> WhatsApp: {whatsapp}
            </a>
          )}
          {viber && (
            <a href={`viber://chat?number=${viber.replace(/[^0-9]/g, "")}`} className="flex items-center gap-2 text-sm text-text hover:underline">
              <span>📱</span> Viber: {viber}
            </a>
          )}
          {telegram && (
            <a href={`https://t.me/${telegram.replace("@", "")}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-text hover:underline">
              <span>✈️</span> Telegram: {telegram}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "upravo sada";
  if (seconds < 3600) return `prije ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `prije ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `prije ${Math.floor(seconds / 86400)} dana`;
  return `prije ${Math.floor(seconds / 604800)} tj.`;
}
