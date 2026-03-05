import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const ads = await prisma.ad.findMany({
    select: { id: true, title: true, city: { select: { name: true } }, images: { select: { url: true }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  for (const ad of ads) {
    console.log(`${ad.id} | ${ad.title.slice(0, 50)} | ${ad.city?.name || "?"} | ${ad.images[0]?.url || "no img"}`);
  }
  await prisma.$disconnect();
}
main();
