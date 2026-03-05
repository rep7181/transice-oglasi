#!/bin/bash
cd /Users/martin/transoglasi
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
npx tsx scripts/daily-scrape.ts >> scripts/scrape.log 2>&1
