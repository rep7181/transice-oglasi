"use client";

import { Suspense } from "react";
import SearchFilters from "./SearchFilters";

interface Props {
  categories: { name: string; slug: string }[];
  currentCategory?: string;
}

export default function SearchFiltersWrapper(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="w-20 h-10 bg-gray-100 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-7 bg-gray-100 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <SearchFilters {...props} />
    </Suspense>
  );
}
