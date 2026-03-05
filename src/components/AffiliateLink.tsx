const AFF_URL =
  "https://t.datsk11.com/365418/6488?bo=2753,2754,2755,2756&aff_sub5=SF_006OG000004lmDN";

interface AffiliateLinkProps {
  location?: string;
  variant?: "chip" | "button" | "banner";
}

export default function AffiliateLink({ location, variant = "chip" }: AffiliateLinkProps) {
  const text = location ? `Trans Dating ${location}` : "Trans Dating";

  if (variant === "chip") {
    return (
      <a
        href={AFF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gray-100 border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 text-[11px] font-medium px-2 py-0.5 rounded transition"
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
        className="inline-block bg-gray-100 border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full transition"
      >
        {text}
      </a>
    );
  }

  // banner
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
      <a
        href={AFF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-bold text-gray-700 hover:text-black transition underline underline-offset-2"
      >
        {text} — Pronađi partnera!
      </a>
    </div>
  );
}
