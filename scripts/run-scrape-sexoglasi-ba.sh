#!/bin/bash
cd /Users/martin/transoglasi
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
npx tsx scripts/scrape-sexoglasi-ba.ts >> scripts/scrape-sexoglasi-ba.log 2>&1
