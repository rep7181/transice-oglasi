const AFF_URL =
  "https://t.datsk11.com/365418/6488?bo=2753,2754,2755,2756&aff_sub5=SF_006OG000004lmDN";

interface AffiliateLinkProps {
  location?: string;
  variant?: "chip" | "button" | "banner";
}

export default function AffiliateLink({ location, variant = "chip" }: AffiliateLinkProps) {
  const text = location ? `GAY Dating ${location}` : "GAY Dating Hrvatska";

  if (variant === "chip") {
    return (
      <a
        href={AFF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-pink-50 border border-pink-200 hover:border-pink-400 text-pink-600 hover:text-pink-700 text-[11px] font-medium px-2 py-0.5 rounded transition"
      >
        {text}
      </a>
    );
  }

  if (variant === "button") {
    return (
      <a
        href={AFF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-pink-50 border border-pink-200 hover:border-pink-400 text-pink-600 hover:text-pink-700 text-sm font-medium px-3 py-1.5 rounded-full transition"
      >
        {text}
      </a>
    );
  }

  // banner
  return (
    <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 rounded-lg p-4 text-center">
      <a
        href={AFF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-bold text-pink-600 hover:text-pink-700 transition underline underline-offset-2"
      >
        🔥 {text} — Pronađi partnera!
      </a>
    </div>
  );
}
