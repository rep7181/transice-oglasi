#!/bin/bash
cd /Users/martin/transoglasi
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
npx tsx scripts/scrape-sexsmsoglasi.ts 0 5 >> scripts/scrape-sexsmsoglasi.log 2>&1
