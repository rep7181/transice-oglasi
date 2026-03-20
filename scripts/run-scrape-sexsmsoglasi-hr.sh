#!/bin/bash
cd /Users/martin/transoglasi
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
npx tsx scripts/scrape-sexsmsoglasi-hr.ts 0 5 >> scripts/scrape-sexsmsoglasi-hr.log 2>&1
