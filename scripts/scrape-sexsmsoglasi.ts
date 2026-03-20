import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SOURCE = "https://sexsmsoglasi.com/trans";
const IMPORTED_FILE = path.join(__dirname, ".imported-sexsmsoglasi.json");

const CITY_MAP: Record<string, { country: string; region: string; city: string }> = {
  "beograd": { country: "srbija", region: "beograd-region", city: "beograd" },
  "novi beograd": { country: "srbija", region: "beograd-region", city: "novi-beograd" },
  "zemun": { country: "srbija", region: "beograd-region", city: "zemun" },
  "novi sad": { country: "srbija", region: "vojvodina", city: "novi-sad" },
  "subotica": { country: "srbija", region: "vojvodina", city: "subotica" },
  "zrenjanin": { country: "srbija", region: "vojvodina", city: "zrenjanin" },
  "pančevo": { country: "srbija", region: "vojvodina", city: "pancevo" },
  "pancevo": { country: "srbija", region: "vojvodina", city: "pancevo" },
  "sombor": { country: "srbija", region: "vojvodina", city: "sombor" },
  "kikinda": { country: "srbija", region: "vojvodina", city: "kikinda" },
  "sremska mitrovica": { country: "srbija", region: "vojvodina", city: "sremska-mitrovica" },
  "vršac": { country: "srbija", region: "vojvodina", city: "vrsac" },
  "vrsac": { country: "srbija", region: "vojvodina", city: "vrsac" },
  "inđija": { country: "srbija", region: "vojvodina", city: "indjija" },
  "indjija": { country: "srbija", region: "vojvodina", city: "indjija" },
  "ruma": { country: "srbija", region: "vojvodina", city: "ruma" },
  "stara pazova": { country: "srbija", region: "vojvodina", city: "stara-pazova" },
  "kragujevac": { country: "srbija", region: "sumadijski-okrug", city: "kragujevac" },
  "niš": { country: "srbija", region: "nisavski-okrug", city: "nis" },
  "nis": { country: "srbija", region: "nisavski-okrug", city: "nis" },
  "čačak": { country: "srbija", region: "moravicki-okrug", city: "cacak" },
  "cacak": { country: "srbija", region: "moravicki-okrug", city: "cacak" },
  "užice": { country: "srbija", region: "zlatiborski-okrug", city: "uzice" },
  "uzice": { country: "srbija", region: "zlatiborski-okrug", city: "uzice" },
  "kraljevo": { country: "srbija", region: "raski-okrug", city: "kraljevo" },
  "novi pazar": { country: "srbija", region: "raski-okrug", city: "novi-pazar" },
  "smederevo": { country: "srbija", region: "podunavski-okrug", city: "smederevo" },
  "jagodina": { country: "srbija", region: "pomoravski-okrug", city: "jagodina" },
  "paraćin": { country: "srbija", region: "pomoravski-okrug", city: "paracin" },
  "paracin": { country: "srbija", region: "pomoravski-okrug", city: "paracin" },
  "valjevo": { country: "srbija", region: "kolubarski-okrug", city: "valjevo" },
  "šabac": { country: "srbija", region: "macvanski-okrug", city: "sabac" },
  "sabac": { country: "srbija", region: "macvanski-okrug", city: "sabac" },
  "loznica": { country: "srbija", region: "macvanski-okrug", city: "loznica" },
  "pirot": { country: "srbija", region: "pirotski-okrug", city: "pirot" },
  "leskovac": { country: "srbija", region: "jablanicki-okrug", city: "leskovac" },
  "vranje": { country: "srbija", region: "pcinjski-okrug", city: "vranje" },
  "bor": { country: "srbija", region: "borski-okrug", city: "bor" },
  "zaječar": { country: "srbija", region: "borski-okrug", city: "zajecar" },
  "zajecar": { country: "srbija", region: "borski-okrug", city: "zajecar" },
  "požarevac": { country: "srbija", region: "podunavski-okrug", city: "smederevo" },
  "pozarevac": { country: "srbija", region: "podunavski-okrug", city: "smederevo" },
  "kruševac": { country: "srbija", region: "raski-okrug", city: "kraljevo" },
  "krusevac": { country: "srbija", region: "raski-okrug", city: "kraljevo" },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[čć]/g, "c").replace(/[šś]/g, "s").replace(/[žź]/g, "z").replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function fetchUtf8(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUtf8(res.headers.location).then(resolve).catch(reject);
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function loadImported(): Set<string> {
  try {
    return new Set(JSON.parse(fs.readFileSync(IMPORTED_FILE, "utf-8")));
  } catch {
    return new Set();
  }
}

function saveImported(urls: Set<string>) {
  fs.writeFileSync(IMPORTED_FILE, JSON.stringify([...urls], null, 2));
}

function detectCity(text: string): string {
  const lower = text.toLowerCase();
  const cities = Object.keys(CITY_MAP);
  for (const city of cities) {
    if (lower.includes(city)) return city;
  }
  return "beograd";
}

function extractAge(text: string): number | undefined {
  const m = text.match(/(\d{2})\s*(?:god|g\b|godina)/i);
  return m ? parseInt(m[1]) : undefined;
}

function extractPhone(text: string): string | undefined {
  const m = text.match(/(\+?381[\d\s\/-]{7,})/);
  if (m) return m[1].replace(/[\s\/-]/g, "");
  const m2 = text.match(/(0\d[\d\s\/-]{7,}\d)/);
  if (m2) { const p = m2[1].replace(/[\s\/-]/g, ""); if (p.length >= 9) return p; }
  return undefined;
}

interface ParsedAd {
  id: string;
  title: string;
  description: string;
  city: string;
  phone?: string;
  age?: number;
  date: string;
}

function parseListingPage(html: string): ParsedAd[] {
  const ads: ParsedAd[] = [];
  const blocks = html.split(/class="apAdBox col100"/i);

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    const idMatch = block.match(/singleAd\((\d+)\)/i)
      || block.match(/apAdBoxHeaderIdLink[^>]*>(\d+)/i);
    if (!idMatch) continue;
    const id = idMatch[1];

    const dateMatch = block.match(/apAdBoxHeaderDate[^>]*>\s*(\d{2}\/\d{2}\/\d{4})/i);
    const date = dateMatch ? dateMatch[1] : "";

    const phoneMatch = block.match(/apAdBoxHeaderPhone[^>]*>\s*([^<]+)/i);
    const maskedPhone = phoneMatch ? phoneMatch[1].trim() : "";

    const contentMatch = block.match(/apAdBoxContentSingleLeft[^>]*>([\s\S]*?)<\/div>/i);
    let content = "";
    if (contentMatch) {
      content = contentMatch[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    }

    if (!content) continue;

    const title = content;
    const city = detectCity(content);
    const age = extractAge(content);
    const phone = extractPhone(maskedPhone) || extractPhone(content);

    ads.push({ id, title, description: content, city, phone, age, date });
  }

  return ads;
}

async function main() {
  const limit = parseInt(process.argv[2] || "0") || 0;
  const now = new Date().toISOString().slice(0, 19);
  console.log(`[${now}] Scraping sexsmsoglasi.com/trans...`);

  const imported = loadImported();
  console.log(`Already imported: ${imported.size} IDs`);

  const maxPages = parseInt(process.argv[3] || "5") || 5;
  const allAds: ParsedAd[] = [];
  let page = 1;
  while (page <= maxPages) {
    const url = page === 1 ? SOURCE : `${SOURCE}/${page}`;
    try {
      const html = await fetchUtf8(url);
      const ads = parseListingPage(html);
      if (ads.length === 0) break;
      allAds.push(...ads);
      console.log(`Page ${page}: ${ads.length} ads`);
      page++;
      await new Promise(r => setTimeout(r, 500));
    } catch (e: any) {
      console.log(`Page ${page}: ${e.message} - stopping pagination`);
      break;
    }
  }

  const newAds = allAds.filter(a => !imported.has(a.id));
  console.log(`Found ${allAds.length} total, ${newAds.length} new`);

  if (newAds.length === 0) {
    console.log("Nothing new. Done.");
    await prisma.$disconnect();
    return;
  }

  const toImport = limit > 0 ? newAds.slice(0, limit) : newAds;

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) { console.error("No admin!"); process.exit(1); }

  const countries = await prisma.country.findMany({ include: { regions: { include: { cities: true } } } });
  const categories = await prisma.category.findMany();
  const transCat = categories.find(c => c.slug === "trans-sex") || categories.find(c => c.slug === "escort") || categories[0];

  function findLocation(cityName: string) {
    const key = cityName.toLowerCase().trim();
    const mapped = CITY_MAP[key];
    if (!mapped) return null;
    const country = countries.find(c => c.slug === mapped.country);
    if (!country) return null;
    const region = country.regions.find((r: any) => r.slug === mapped.region);
    const city = region?.cities.find((c: any) => c.slug === mapped.city);
    return { countryId: country.id, regionId: region?.id, cityId: city?.id };
  }

  let created = 0;
  for (const ad of toImport) {
    try {
      const exists = await prisma.ad.findFirst({ where: { title: ad.title } });
      if (exists) {
        console.log(`  SKIP duplicate: "${ad.title.slice(0, 40)}"`);
        imported.add(ad.id);
        continue;
      }

      const loc = findLocation(ad.city) || findLocation("beograd")!;
      const slug = slugify(ad.title) + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);

      await prisma.ad.create({
        data: {
          title: ad.title,
          slug,
          description: ad.description,
          age: ad.age || null,
          phone: ad.phone || null,
          status: "ACTIVE",
          userId: admin.id,
          countryId: loc.countryId,
          regionId: loc.regionId || null,
          cityId: loc.cityId || null,
          categoryId: transCat.id,
        },
      });

      console.log(`  NEW: "${ad.title.slice(0, 50)}" | ${ad.city}`);
      imported.add(ad.id);
      created++;
    } catch (e: any) {
      console.error(`  ERR [${ad.id}]: ${e.message}`);
    }
  }

  saveImported(imported);
  console.log(`\nDone! Created ${created} new ads. Total imported: ${imported.size}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
