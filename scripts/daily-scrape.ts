import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SOURCES = [
  "https://ljubavni-oglasnik.net/oglasi/sex/pretraga.php?id=97",
  "https://ljubavni-oglasnik.net/oglasi/druzenje/pretraga.php?id=98",
];

const IMPORTED_FILE = process.env.IMPORTED_FILE || path.join(__dirname, ".imported-urls.json");

const CITY_MAP: Record<string, { country: string; region: string; city: string }> = {
  "zagreb": { country: "hrvatska", region: "grad-zagreb", city: "zagreb" },
  "split": { country: "hrvatska", region: "splitsko-dalmatinska", city: "split" },
  "rijeka": { country: "hrvatska", region: "primorsko-goranska", city: "rijeka" },
  "osijek": { country: "hrvatska", region: "osjecko-baranjska", city: "osijek" },
  "našice": { country: "hrvatska", region: "osjecko-baranjska", city: "nasice" },
  "nasice": { country: "hrvatska", region: "osjecko-baranjska", city: "nasice" },
  "varaždin": { country: "hrvatska", region: "varazdinska", city: "varazdin" },
  "dubrovnik": { country: "hrvatska", region: "dubrovacko-neretvanska", city: "dubrovnik" },
  "zadar": { country: "hrvatska", region: "zadarska", city: "zadar" },
  "pula": { country: "hrvatska", region: "istarska", city: "pula" },
  "beograd": { country: "srbija", region: "beograd-region", city: "beograd" },
  "novi sad": { country: "srbija", region: "vojvodina", city: "novi-sad" },
  "niš": { country: "srbija", region: "nisavski", city: "nis" },
  "sarajevo": { country: "bosna-i-hercegovina", region: "kanton-sarajevo", city: "sarajevo" },
  "banja luka": { country: "bosna-i-hercegovina", region: "republika-srpska", city: "banja-luka" },
  "ljubljana": { country: "slovenija", region: "osrednjeslovenska", city: "ljubljana" },
  "podgorica": { country: "crna-gora", region: "podgorica-region", city: "podgorica" },
  "skopje": { country: "sjeverna-makedonija", region: "skopski", city: "skopje" },
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
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" } }, (res) => {
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
    const data = JSON.parse(fs.readFileSync(IMPORTED_FILE, "utf-8"));
    return new Set(data);
  } catch {
    return new Set();
  }
}

function saveImported(urls: Set<string>) {
  fs.writeFileSync(IMPORTED_FILE, JSON.stringify([...urls], null, 2));
}

function parseAd(html: string) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let title = h1 ? h1[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";

  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
  let description = ogDesc ? ogDesc[1].trim() : "";

  const bodyMatch = html.match(/class="ad-main-data-el-td-info"([\s\S]*?)<\/table>/i);
  if (bodyMatch) {
    const lines = bodyMatch[1].match(/<br\s*\/?>\s*([^<]+)/gi);
    if (lines) {
      const full = lines.map(l => l.replace(/<br\s*\/?>/gi, "").trim()).filter(Boolean).join("\n");
      if (full.length > description.length) description = full;
    }
  }

  const locMatch = html.match(/<td>(Hrvatska|Srbija|BiH|Slovenija|Crna Gora|Bosna)\s*-\s*([^<]+)<\/td>/i);
  let city = locMatch ? locMatch[2].trim().toLowerCase() : "";
  if (!city) {
    const cityInTitle = title.match(/(Zagreb|Split|Rijeka|Osijek|Našice|Beograd|Sarajevo|Ljubljana|Podgorica|Skopje|Dubrovnik)/i);
    if (cityInTitle) city = cityInTitle[1].toLowerCase();
  }
  if (!city) city = "zagreb";

  const phoneMatch = html.match(/(?:tel|mob|phone|nazovi|zovi)[:\s]*([0-9\s/+-]{8,})/i)
    || html.match(/\b(0\d{2}[\s/-]?\d{3,4}[\s/-]?\d{3,4})\b/);
  const phone = phoneMatch ? phoneMatch[1].replace(/[\s/-]/g, "") : undefined;

  const waMatch = html.match(/wocap[:\s-]*(\d[\d\s/-]{7,})/i)
    || html.match(/whatsapp[:\s-]*(\d[\d\s/-]{7,})/i);
  const whatsapp = waMatch ? waMatch[1].replace(/[\s/-]/g, "") : undefined;

  const ageMatch = html.match(/\((\d{2})\s*god/i) || html.match(/Dob:\s*(\d{2})/i);
  const age = ageMatch ? parseInt(ageMatch[1]) : undefined;

  const imageUrls: string[] = [];
  const imgRegex = /href="(https:\/\/ljubavni-oglasnik\.net\/uploads\/images\/oglasi\/img_[^"]+)"/g;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    if (!imageUrls.includes(m[1])) imageUrls.push(m[1]);
  }
  if (imageUrls.length === 0) {
    const ogImg = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
    if (ogImg && ogImg[1].includes("uploads/images")) imageUrls.push(ogImg[1]);
  }

  return { title, description, city, phone, whatsapp, age, imageUrls };
}

async function main() {
  const now = new Date().toISOString().slice(0, 19);
  console.log(`[${now}] Daily scrape starting...`);

  const imported = loadImported();
  console.log(`Already imported: ${imported.size} URLs`);

  // Collect all ad URLs from source pages
  const allAdUrls = new Set<string>();
  for (const source of SOURCES) {
    try {
      const html = await fetchUtf8(source);
      const regex = /href="(https:\/\/ljubavni-oglasnik\.net\/oglasi\/detalji\/[^"]+)"/g;
      let m;
      while ((m = regex.exec(html)) !== null) allAdUrls.add(m[1]);
    } catch (e: any) {
      console.error(`Failed to fetch ${source}: ${e.message}`);
    }
  }

  // Filter out already imported
  const newUrls = [...allAdUrls].filter(u => !imported.has(u));
  console.log(`Found ${allAdUrls.size} total, ${newUrls.length} new`);

  if (newUrls.length === 0) {
    console.log("Nothing new. Done.");
    await prisma.$disconnect();
    return;
  }

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) { console.error("No admin!"); process.exit(1); }

  const countries = await prisma.country.findMany({ include: { regions: { include: { cities: true } } } });
  const categories = await prisma.category.findMany();
  const defaultCat = categories.find(c => c.slug === "escort") || categories[0];

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
  for (const url of newUrls) {
    try {
      const html = await fetchUtf8(url);
      const ad = parseAd(html);
      if (!ad.title) { console.log(`  SKIP: no title`); imported.add(url); continue; }

      // Double-check: skip if title already exists in DB
      const exists = await prisma.ad.findFirst({ where: { title: ad.title } });
      if (exists) {
        console.log(`  SKIP duplicate: "${ad.title.slice(0, 40)}"`);
        imported.add(url);
        continue;
      }

      const loc = findLocation(ad.city) || findLocation("zagreb")!;
      const slug = slugify(ad.title) + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);

      // Use original image URLs directly (no download needed)
      const imageUrls = ad.imageUrls.slice(0, 5);

      await prisma.ad.create({
        data: {
          title: ad.title,
          slug,
          description: ad.description || ad.title,
          age: ad.age || null,
          phone: ad.phone || ad.whatsapp || null,
          whatsapp: ad.whatsapp || null,
          status: "ACTIVE",
          userId: admin.id,
          countryId: loc.countryId,
          regionId: loc.regionId || null,
          cityId: loc.cityId || null,
          categoryId: defaultCat.id,
          images: imageUrls.length > 0 ? {
            create: imageUrls.map((u, i) => ({ url: u, order: i }))
          } : undefined,
        },
      });

      console.log(`  NEW: "${ad.title.slice(0, 50)}" | ${ad.city} | ${imageUrls.length} imgs`);
      imported.add(url);
      created++;
      await new Promise(r => setTimeout(r, 300));
    } catch (e: any) {
      console.error(`  ERR: ${e.message}`);
    }
  }

  saveImported(imported);
  console.log(`\nDone! Created ${created} new ads. Total imported: ${imported.size}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
