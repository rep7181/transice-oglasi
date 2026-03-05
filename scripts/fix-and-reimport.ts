import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CITY_MAP: Record<string, { country: string; region: string; city: string }> = {
  "zagreb": { country: "hrvatska", region: "grad-zagreb", city: "zagreb" },
  "split": { country: "hrvatska", region: "splitsko-dalmatinska", city: "split" },
  "rijeka": { country: "hrvatska", region: "primorsko-goranska", city: "rijeka" },
  "osijek": { country: "hrvatska", region: "osjecko-baranjska", city: "osijek" },
  "našice": { country: "hrvatska", region: "osjecko-baranjska", city: "nasice" },
  "nasice": { country: "hrvatska", region: "osjecko-baranjska", city: "nasice" },
  "varaždin": { country: "hrvatska", region: "varazdinska", city: "varazdin" },
  "beograd": { country: "srbija", region: "beograd-region", city: "beograd" },
  "novi sad": { country: "srbija", region: "vojvodina", city: "novi-sad" },
  "niš": { country: "srbija", region: "nisavski", city: "nis" },
  "sarajevo": { country: "bosna-i-hercegovina", region: "kanton-sarajevo", city: "sarajevo" },
  "banja luka": { country: "bosna-i-hercegovina", region: "republika-srpska", city: "banja-luka" },
  "ljubljana": { country: "slovenija", region: "osrednjeslovenska", city: "ljubljana" },
  "podgorica": { country: "crna-gora", region: "podgorica-region", city: "podgorica" },
  "skopje": { country: "sjeverna-makedonija", region: "skopski", city: "skopje" },
  "dubrovnik": { country: "hrvatska", region: "dubrovacko-neretvanska", city: "dubrovnik" },
  "zadar": { country: "hrvatska", region: "zadarska", city: "zadar" },
  "pula": { country: "hrvatska", region: "istarska", city: "pula" },
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

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on("finish", () => { ws.close(); resolve(); });
      ws.on("error", reject);
    }).on("error", reject);
  });
}

interface ParsedAd {
  title: string;
  description: string;
  city: string;
  phone?: string;
  whatsapp?: string;
  age?: number;
  imageUrls: string[];
}

function parseAd(html: string): ParsedAd {
  // Title from <h1>
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let title = h1 ? h1[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";

  // Description from og:description
  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
  let description = ogDesc ? ogDesc[1].trim() : "";

  // Try to get fuller description from the page body
  const bodyTextMatch = html.match(/class="ad-main-data-el-td-info"([\s\S]*?)<\/table>/i);
  if (bodyTextMatch) {
    const lines = bodyTextMatch[1].match(/<br\s*\/?>\s*([^<]+)/gi);
    if (lines) {
      const fullText = lines.map(l => l.replace(/<br\s*\/?>/gi, "").trim()).filter(Boolean).join("\n");
      if (fullText.length > description.length) description = fullText;
    }
  }

  // Location
  const locMatch = html.match(/<td>(Hrvatska|Srbija|BiH|Slovenija|Crna Gora|Bosna)\s*-\s*([^<]+)<\/td>/i);
  let city = locMatch ? locMatch[2].trim().toLowerCase() : "";

  // Also try to detect city from title
  if (!city) {
    const cityInTitle = title.match(/(Zagreb|Split|Rijeka|Osijek|Našice|Beograd|Sarajevo|Ljubljana|Podgorica|Skopje|Rijeka|Dubrovnik)/i);
    if (cityInTitle) city = cityInTitle[1].toLowerCase();
  }
  if (!city) city = "zagreb"; // default

  // Phone
  const phoneMatch = html.match(/(?:tel|mob|phone|nazovi|zovi)[:\s]*([0-9\s/+-]{8,})/i)
    || html.match(/\b(0\d{2}[\s/-]?\d{3,4}[\s/-]?\d{3,4})\b/);
  const phone = phoneMatch ? phoneMatch[1].replace(/[\s/-]/g, "") : undefined;

  // WhatsApp
  const waMatch = html.match(/wocap[:\s-]*(\d[\d\s/-]{7,})/i)
    || html.match(/whatsapp[:\s-]*(\d[\d\s/-]{7,})/i);
  const whatsapp = waMatch ? waMatch[1].replace(/[\s/-]/g, "") : undefined;

  // Age
  const ageMatch = html.match(/\((\d{2})\s*god/i) || html.match(/Dob:\s*(\d{2})/i);
  const age = ageMatch ? parseInt(ageMatch[1]) : undefined;

  // Images
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
  console.log("=== Delete old scraped ads & reimport ===\n");

  // Delete all existing ads (they're all scraped)
  const deleted = await prisma.image.deleteMany({});
  console.log(`Deleted ${deleted.count} images from DB`);
  const deletedAds = await prisma.ad.deleteMany({});
  console.log(`Deleted ${deletedAds.count} ads from DB`);

  // Clean uploads folder (keep demo folder)
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const files = fs.readdirSync(uploadsDir);
  for (const f of files) {
    if (f === "demo" || f === ".gitkeep") continue;
    const fp = path.join(uploadsDir, f);
    if (fs.statSync(fp).isFile()) fs.unlinkSync(fp);
  }
  console.log("Cleaned uploads folder\n");

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) { console.error("No admin!"); process.exit(1); }

  const countries = await prisma.country.findMany({ include: { regions: { include: { cities: true } } } });
  const categories = await prisma.category.findMany();

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

  const defaultCat = categories.find(c => c.slug === "escort") || categories[0];
  const urls = fs.readFileSync("/tmp/ad_urls.txt", "utf-8").trim().split("\n").filter(Boolean);
  console.log(`Importing ${urls.length} ads...\n`);

  let created = 0;
  for (const url of urls) {
    try {
      const shortName = url.split("/detalji/")[1]?.split("/")[0] || "?";
      const html = await fetchUtf8(url);
      const ad = parseAd(html);

      if (!ad.title) { console.log(`  SKIP ${shortName}: no title`); continue; }

      const loc = findLocation(ad.city) || findLocation("zagreb")!;
      const slug = slugify(ad.title) + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);

      // Download images
      const savedImages: string[] = [];
      for (let i = 0; i < Math.min(ad.imageUrls.length, 5); i++) {
        try {
          const fname = `${slug}-${i}.jpg`;
          await downloadFile(ad.imageUrls[i], path.join(uploadsDir, fname));
          savedImages.push(`/uploads/${fname}`);
        } catch { /* skip */ }
      }

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
          images: savedImages.length > 0 ? {
            create: savedImages.map((u, i) => ({ url: u, order: i }))
          } : undefined,
        },
      });

      console.log(`  OK: "${ad.title.slice(0, 50)}" | ${ad.city} | ${savedImages.length} imgs`);
      created++;
      await new Promise(r => setTimeout(r, 300));
    } catch (e: any) {
      console.error(`  ERR: ${e.message}`);
    }
  }

  console.log(`\nDone! Created ${created}/${urls.length} ads.`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
