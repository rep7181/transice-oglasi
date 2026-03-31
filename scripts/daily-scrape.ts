import { execSync } from "child_process";
import * as path from "path";

const scrapers = [
  "scrape-sexsmsoglasi.ts",
  "scrape-sexsmsoglasi-hr.ts",
  "scrape-sexoglasi-ba.ts",
  "scrape-sexoglasi-me.ts",
  "scrape-avanture-net.ts",
];

const scriptsDir = path.join(__dirname);

for (const scraper of scrapers) {
  const scriptPath = path.join(scriptsDir, scraper);
  console.log(`\n========== Running ${scraper} ==========\n`);
  try {
    execSync(`npx tsx ${scriptPath}`, {
      stdio: "inherit",
      env: process.env,
      timeout: 120_000,
    });
    console.log(`\n✓ ${scraper} completed successfully`);
  } catch (e: any) {
    console.error(`\n✗ ${scraper} failed: ${e.message}`);
    // Continue with next scraper even if one fails
  }
}

console.log("\n========== Daily scrape finished ==========");
