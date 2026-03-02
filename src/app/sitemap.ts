import { MetadataRoute } from "next";
import { COUNTRIES } from "@/lib/countries";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://transoglasi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/registracija`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Country pages
  for (const country of COUNTRIES) {
    routes.push({
      url: `${BASE_URL}/${country.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    });

    // Region pages
    for (const region of country.regions) {
      routes.push({
        url: `${BASE_URL}/${country.slug}/${region.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });

      // City pages
      for (const city of region.cities) {
        routes.push({
          url: `${BASE_URL}/${country.slug}/${region.slug}/${city.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
    }
  }

  return routes;
}
