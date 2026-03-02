"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SearchFiltersProps {
  categories: { name: string; slug: string }[];
  currentCategory?: string;
}

export default function SearchFilters({
  categories,
  currentCategory,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`);
  }

  function selectCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === currentCategory) {
      params.delete("cat");
    } else {
      params.set("cat", slug);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pretraži oglase..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-sm"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Traži
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => selectCategory("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            !currentCategory
              ? "bg-primary text-white"
              : "bg-white text-text-light border border-border hover:border-primary hover:text-primary"
          }`}
        >
          Sve
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => selectCategory(cat.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              currentCategory === cat.slug
                ? "bg-primary text-white"
                : "bg-white text-text-light border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
