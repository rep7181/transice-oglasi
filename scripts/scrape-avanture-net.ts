import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SOURCE = "https://www.avanture.net/classifieds/category/trans-i%c5%a1%c4%8de";
const IMPORTED_FILE = path.join(__dirname, ".imported-avanture-net.json");

const CITY_MAP: Record<string, { country: string; region: string; city: string }> = {
  "ljubljana": { country: "slovenija", region: "osrednjeslovenska", city: "ljubljana" },
  "domžale": { country: "slovenija", region: "osrednjeslovenska", city: "domzale" },
  "domzale": { country: "slovenija", region: "osrednjeslovenska", city: "domzale" },
  "kamnik": { country: "slovenija", region: "osrednjeslovenska", city: "kamnik" },
  "grosuplje": { country: "slovenija", region: "osrednjeslovenska", city: "grosuplje" },
  "litija": { country: "slovenija", region: "osrednjeslovenska", city: "litija" },
  "brezovica": { country: "slovenija", region: "osrednjeslovenska", city: "ljubljana" },
  "brezovica pri ljubljani": { country: "slovenija", region: "osrednjeslovenska", city: "ljubljana" },
  "maribor": { country: "slovenija", region: "podravska", city: "maribor" },
  "ptuj": { country: "slovenija", region: "podravska", city: "ptuj" },
  "slovenska bistrica": { country: "slovenija", region: "podravska", city: "slovenska-bistrica" },
  "lenart": { country: "slovenija", region: "podravska", city: "lenart" },
  "celje": { country: "slovenija", region: "savinjska", city: "celje" },
  "velenje": { country: "slovenija", region: "savinjska", city: "velenje" },
  "žalec": { country: "slovenija", region: "savinjska", city: "zalec" },
  "šentjur": { country: "slovenija", region: "savinjska", city: "sentjur" },
  "šoštanj": { country: "slovenija", region: "savinjska", city: "velenje" },
  "kranj": { country: "slovenija", region: "gorenjska", city: "kranj" },
  "škofja loka": { country: "slovenija", region: "gorenjska", city: "skofja-loka" },
  "jesenice": { country: "slovenija", region: "gorenjska", city: "jesenice" },
  "radovljica": { country: "slovenija", region: "gorenjska", city: "radovljica" },
  "koper": { country: "slovenija", region: "obalno-kraska", city: "koper" },
  "izola": { country: "slovenija", region: "obalno-kraska", city: "izola" },
  "piran": { country: "slovenija", region: "obalno-kraska", city: "piran" },
  "sežana": { country: "slovenija", region: "obalno-kraska", city: "sezana" },
  "postojna": { country: "slovenija", region: "obalno-kraska", city: "koper" },
  "nova gorica": { country: "slovenija", region: "goriska", city: "nova-gorica" },
  "murska sobota": { country: "slovenija", region: "pomurska", city: "murska-sobota" },
  "novo mesto": { country: "slovenija", region: "jugovzhodna-slovenija", city: "novo-mesto" },
  "slovenj gradec": { country: "slovenija", region: "koroska", city: "slovenj-gradec" },
  "krško": { country: "slovenija", region: "posavska", city: "krsko" },
  "brežice": { country: "slovenija", region: "posavska", city: "brezice" },
  "trbovlje": { country: "slovenija", region: "zasavska", city: "trbovlje" },
  "radeče": { country: "slovenija", region: "zasavska", city: "trbovlje" },
  "radece": { country: "slovenija", region: "zasavska", city: "trbovlje" },
  "slovenske konjice": { country: "slovenija", region: "savinjska", city: "celje" },
  "podčetrtek": { country: "slovenija", region: "savinjska", city: "celje" },
  "umag": { country: "slovenija", region: "obalno-kraska", city: "koper" },
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
        const loc = res.headers.location.startsWith("http") ? res.headers.location : `https://www.avanture.net${res.headers.location}`;
        return fetchUtf8(loc).then(resolve).catch(reject);
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

function detectCity(location: string, text: string): string {
  const lower = (location + " " + text).toLowerCase();
  const cities = Object.keys(CITY_MAP);
  // Try longest matches first
  const sorted = cities.sort((a, b) => b.length - a.length);
  for (const city of sorted) {
    if (lower.includes(city)) return city;
  }
  return "ljubljana";
}

function extractPhone(text: string): string | undefined {
  const m = text.match(/(\+?386[\d\s\/-]{7,})/);
  if (m) return m[1].replace(/[\s\/-]/g, "");
  const m2 = text.match(/(0\d[\d\s\/-]{7,}\d)/);
  if (m2) { const p = m2[1].replace(/[\s\/-]/g, ""); if (p.length >= 9) return p; }
  return undefined;
}

function extractAge(text: string): number | undefined {
  const m = text.match(/(\d{2})\s*(?:let|god|g\b|godina)/i);
  return m ? parseInt(m[1]) : undefined;
}

interface ParsedAd {
  id: string;
  title: string;
  description: string;
  location: string;
  age?: number;
  phone?: string;
  imageUrl?: string;
}

function parseListingPage(html: string): ParsedAd[] {
  const ads: ParsedAd[] = [];

  // Split by ad blocks
  const blocks = html.split(/id="row-classified-listing-(\d+)"/);

  for (let i = 1; i < blocks.length; i += 2) {
    const id = blocks[i];
    const block = blocks[i + 1] || "";

    // Extract title
    const titleMatch = block.match(/classifieds\/view\/\d+\/[^"]*"[^>]*>([^<]+)/);
    const title = titleMatch ? titleMatch[1].trim() : "";
    if (!title) continue;

    // Extract description from <p class="text-ellipsis">
    const descMatch = block.match(/text-ellipsis[^>]*>([\s\S]*?)<\/p>/i);
    const description = descMatch
      ? descMatch[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
      : title;

    // Extract location from <span class="location ..."><strong>City</strong>
    const locMatch = block.match(/class="location[^"]*"[^>]*>\s*<strong>([^<]+)/i);
    const location = locMatch ? locMatch[1].trim() : "";

    // Extract age: "38 let"
    const ageMatch = block.match(/(\d{2,3})\s*let/i);
    const age = ageMatch ? parseInt(ageMatch[1]) : undefined;

    // Extract image
    const imgMatch = block.match(/src="(https:\/\/www\.avanture\.net\/uploads\/[^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : undefined;

    // Extract phone from description
    const phone = extractPhone(description);

    ads.push({ id, title, description, location, age, phone, imageUrl });
  }

  return ads;
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" } }, (res) => {
      if (res.statusCode !== 200) { resolve(false); return; }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 1000) { resolve(false); return; }
        fs.writeFileSync(destPath, buf);
        resolve(true);
      });
      res.on("error", () => resolve(false));
    }).on("error", () => resolve(false));
  });
}

async function main() {
  const limit = parseInt(process.argv[2] || "0") || 0;
  const now = new Date().toISOString().slice(0, 19);
  console.log(`[${now}] Scraping avanture.net trans...`);

  const imported = loadImported();
  console.log(`Already imported: ${imported.size} IDs`);

  const maxPages = parseInt(process.argv[3] || "5") || 5;
  const allAds: ParsedAd[] = [];
  let page = 1;
  while (page <= maxPages) {
    const url = page === 1 ? SOURCE : `${SOURCE}?page=${page}`;
    try {
      const html = await fetchUtf8(url);
      const ads = parseListingPage(html);
      if (ads.length === 0) break;
      allAds.push(...ads);
      console.log(`Page ${page}: ${ads.length} ads`);
      page++;
      await new Promise(r => setTimeout(r, 500));
    } catch (e: any) {
      console.log(`Page ${page}: ${e.message} - stopping`);
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

  const uploadsDir = path.join(__dirname, "..", "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  let created = 0;
  for (const ad of toImport) {
    try {
      const exists = await prisma.ad.findFirst({ where: { title: ad.title } });
      if (exists) {
        console.log(`  SKIP duplicate: "${ad.title.slice(0, 40)}"`);
        imported.add(ad.id);
        continue;
      }

      const city = detectCity(ad.location, ad.description);
      const loc = findLocation(city) || findLocation("ljubljana")!;
      const slug = slugify(ad.title) + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);

      // Download image if available
      let imagePath: string | null = null;
      if (ad.imageUrl) {
        const ext = ad.imageUrl.match(/\.(jpe?g|png|webp)/i)?.[1] || "jpg";
        const filename = `${slug}-0.${ext}`;
        const destPath = path.join(uploadsDir, filename);
        const ok = await downloadImage(ad.imageUrl, destPath);
        if (ok) imagePath = `/uploads/${filename}`;
      }

      const newAd = await prisma.ad.create({
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

      if (imagePath) {
        await prisma.image.create({
          data: { url: imagePath, adId: newAd.id },
        });
      }

      console.log(`  NEW: "${ad.title.slice(0, 50)}" | ${city}${imagePath ? " [img]" : ""}`);
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
