import { Link } from "@/i18n/navigation";

interface CountryItem {
  name: string;
  slug: string;
  flag: string;
  adCount: number;
}

interface CountryGridProps {
  countries: CountryItem[];
}

export default function CountryGrid({ countries }: CountryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {countries.map((country) => (
        <Link
          key={country.slug}
          href={`/${country.slug}`}
          className="bg-white rounded-xl p-4 border border-border hover:border-primary hover:shadow-md transition-all group text-center"
        >
          <span className="text-3xl block mb-2">{country.flag}</span>
          <span className="font-semibold text-sm text-text group-hover:text-primary transition">
            {country.name}
          </span>
          <span className="block text-xs text-text-light mt-1">
            {country.adCount} {country.adCount === 1 ? "oglas" : "oglasa"}
          </span>
        </Link>
      ))}
    </div>
  );
}
