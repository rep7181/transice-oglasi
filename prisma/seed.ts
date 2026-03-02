import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { COUNTRIES, CATEGORIES } from "../src/lib/countries";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, order: cat.order },
    });
  }
  console.log(`Created ${CATEGORIES.length} categories`);

  // Create countries, regions, cities
  for (const c of COUNTRIES) {
    const country = await prisma.country.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        code: c.code,
        flag: c.flag,
      },
    });

    for (const r of c.regions) {
      const region = await prisma.region.upsert({
        where: { slug_countryId: { slug: r.slug, countryId: country.id } },
        update: {},
        create: {
          name: r.name,
          slug: r.slug,
          countryId: country.id,
        },
      });

      for (const ci of r.cities) {
        await prisma.city.upsert({
          where: { slug_regionId: { slug: ci.slug, regionId: region.id } },
          update: {},
          create: {
            name: ci.name,
            slug: ci.slug,
            regionId: region.id,
          },
        });
      }
    }
  }
  console.log(`Created ${COUNTRIES.length} countries with regions and cities`);

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@transice-oglasi.com" },
    update: {},
    create: {
      email: "admin@transice-oglasi.com",
      password: adminPassword,
      name: "Admin",
      role: "ADMIN",
      verified: true,
    },
  });
  console.log("Created admin user: admin@transice-oglasi.com / admin123");

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
