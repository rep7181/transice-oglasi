import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const t = useTranslations("common");
  return (
    <nav className="text-sm text-text-light mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-primary transition">
            {t("home")}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="text-gray-400">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-primary transition">
                {item.label}
              </Link>
            ) : (
              <span className="text-text font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
