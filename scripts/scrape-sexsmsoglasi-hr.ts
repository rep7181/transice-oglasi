import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SOURCE = "https://sexsmsoglasi.com.hr/trans";
const IMPORTED_FILE = path.join(__dirname, ".imported-sexsmsoglasi-hr.json");

const CITY_MAP: Record<string, { country: string; region: string; city: string }> = {
  "zagreb": { country: "hrvatska", region: "grad-zagreb", city: "zagreb" },
  "split": { country: "hrvatska", region: "splitsko-dalmatinska", city: "split" },
  "rijeka": { country: "hrvatska", region: "primorsko-goranska", city: "rijeka" },
  "osijek": { country: "hrvatska", region: "osjecko-baranjska", city: "osijek" },
  "zadar": { country: "hrvatska", region: "zadarska", city: "zadar" },
  "pula": { country: "hrvatska", region: "istarska", city: "pula" },
  "dubrovnik": { country: "hrvatska", region: "dubrovacko-neretvanska", city: "dubrovnik" },
  "varaždin": { country: "hrvatska", region: "varazdinska", city: "varazdin" },
  "varazdin": { country: "hrvatska", region: "varazdinska", city: "varazdin" },
  "karlovac": { country: "hrvatska", region: "karlovacka", city: "karlovac" },
  "slavonski brod": { country: "hrvatska", region: "brodsko-posavska", city: "slavonski-brod" },
  "sisak": { country: "hrvatska", region: "sisacko-moslavacka", city: "sisak" },
  "vukovar": { country: "hrvatska", region: "vukovarsko-srijemska", city: "vukovar" },
  "vinkovci": { country: "hrvatska", region: "vukovarsko-srijemska", city: "vinkovci" },
  "šibenik": { country: "hrvatska", region: "sibensko-kninska", city: "sibenik" },
  "sibenik": { country: "hrvatska", region: "sibensko-kninska", city: "sibenik" },
  "koprivnica": { country: "hrvatska", region: "koprivnicko-krizevacka", city: "koprivnica" },
  "čakovec": { country: "hrvatska", region: "medjimurska", city: "cakovec" },
  "cakovec": { country: "hrvatska", region: "medjimurska", city: "cakovec" },
  "bjelovar": { country: "hrvatska", region: "bjelovarsko-bilogorska", city: "bjelovar" },
  "požega": { country: "hrvatska", region: "pozesko-slavonska", city: "pozega" },
  "pozega": { country: "hrvatska", region: "pozesko-slavonska", city: "pozega" },
  "virovitica": { country: "hrvatska", region: "viroviticko-podravska", city: "virovitica" },
  "makarska": { country: "hrvatska", region: "splitsko-dalmatinska", city: "makarska" },
  "trogir": { country: "hrvatska", region: "splitsko-dalmatinska", city: "trogir" },
  "našice": { country: "hrvatska", region: "osjecko-baranjska", city: "nasice" },
  "nasice": { country: "hrvatska", region: "osjecko-baranjska", city: "nasice" },
  "đakovo": { country: "hrvatska", region: "osjecko-baranjska", city: "djakovo" },
  "djakovo": { country: "hrvatska", region: "osjecko-baranjska", city: "djakovo" },
  "samobor": { country: "hrvatska", region: "zagrebacka", city: "samobor" },
  "velika gorica": { country: "hrvatska", region: "zagrebacka", city: "velika-gorica" },
  "zaprešić": { country: "hrvatska", region: "zagrebacka", city: "zapresic" },
  "zapresic": { country: "hrvatska", region: "zagrebacka", city: "zapresic" },
  "zagorje": { country: "hrvatska", region: "krapinsko-zagorska", city: "krapina" },
  "krapina": { country: "hrvatska", region: "krapinsko-zagorska", city: "krapina" },
  "zabok": { country: "hrvatska", region: "krapinsko-zagorska", city: "zabok" },
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
  try { return new Set(JSON.parse(fs.readFileSync(IMPORTED_FILE, "utf-8"))); } catch { return new Set(); }
}
function saveImported(urls: Set<string>) {
  fs.writeFileSync(IMPORTED_FILE, JSON.stringify([...urls], null, 2));
}

function detectCity(text: string): string {
  const lower = text.toLowerCase();
  for (const city of Object.keys(CITY_MAP)) { if (lower.includes(city)) return city; }
  return "zagreb";
}

function extractAge(text: string): number | undefined {
  const m = text.match(/(\d{2})\s*(?:god|g\b|godina)/i);
  return m ? parseInt(m[1]) : undefined;
}

function extractPhone(text: string): string | undefined {
  const m = text.match(/(\+?385[\d\s\/-]{7,})/);
  if (m) return m[1].replace(/[\s\/-]/g, "");
  const m2 = text.match(/(0\d[\d\s\/-]{7,}\d)/);
  if (m2) { const p = m2[1].replace(/[\s\/-]/g, ""); if (p.length >= 9) return p; }
  return undefined;
}

interface ParsedAd { id: string; title: string; description: string; city: string; phone?: string; age?: number; date: string; }

function parseListingPage(html: string): ParsedAd[] {
  const ads: ParsedAd[] = [];
  const blocks = html.split(/class="item_box"/i);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const idMatch = block.match(/item_header_id[^>]*>(\d+)/i) || block.match(/singleUnit\((\d+)\)/i);
    if (!idMatch) continue;
    const id = idMatch[1];
    const dateMatch = block.match(/(\d{2}[\/.]\d{2}[\/.]\d{4})/);
    const date = dateMatch ? dateMatch[1] : "";
    const phoneMatch = block.match(/item_header_phone[^>]*>([^<]+)/i);
    const maskedPhone = phoneMatch ? phoneMatch[1].trim() : "";
    const contentMatch = block.match(/item_content_left[^>]*>([\s\S]*?)<\/div>/i) || block.match(/item_content[^>]*>([\s\S]*?)<\/div>/i);
    let content = "";
    if (contentMatch) { content = contentMatch[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
    if (!content) continue;
    ads.push({ id, title: content, description: content, city: detectCity(content), phone: extractPhone(maskedPhone) || extractPhone(content), age: extractAge(content), date });
  }
  return ads;
}

async function main() {
  const limit = parseInt(process.argv[2] || "0") || 0;
  const maxPages = parseInt(process.argv[3] || "10") || 10;
  console.log(`[${new Date().toISOString().slice(0,19)}] Scraping sexsmsoglasi.com.hr/trans...`);
  const imported = loadImported();
  console.log(`Already imported: ${imported.size} IDs`);

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
    } catch (e: any) { console.log(`Page ${page}: ${e.message} - stopping`); break; }
  }

  const newAds = allAds.filter(a => !imported.has(a.id));
  console.log(`Found ${allAds.length} total, ${newAds.length} new`);
  if (newAds.length === 0) { console.log("Nothing new."); await prisma.$disconnect(); return; }

  const toImport = limit > 0 ? newAds.slice(0, limit) : newAds;
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) { console.error("No admin!"); process.exit(1); }
  const countries = await prisma.country.findMany({ include: { regions: { include: { cities: true } } } });
  const categories = await prisma.category.findMany();
  const transCat = categories.find(c => c.slug === "trans-sex") || categories.find(c => c.slug === "escort") || categories[0];

  function findLocation(cityName: string) {
    const mapped = CITY_MAP[cityName.toLowerCase().trim()];
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
      if (exists) { imported.add(ad.id); continue; }
      const loc = findLocation(ad.city) || findLocation("zagreb")!;
      const slug = slugify(ad.title) + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
      await prisma.ad.create({
        data: { title: ad.title, slug, description: ad.description, age: ad.age || null, phone: ad.phone || null, status: "ACTIVE", userId: admin.id, countryId: loc.countryId, regionId: loc.regionId || null, cityId: loc.cityId || null, categoryId: transCat.id },
      });
      console.log(`  NEW: "${ad.title.slice(0, 50)}" | ${ad.city}`);
      imported.add(ad.id); created++;
    } catch (e: any) { console.error(`  ERR [${ad.id}]: ${e.message}`); }
  }

  saveImported(imported);
  console.log(`\nDone! Created ${created} new ads. Total imported: ${imported.size}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
