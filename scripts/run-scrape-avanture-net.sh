#!/bin/bash
cd /Users/martin/transoglasi
export PATH="/usr/local/bin:$PATH"
npx tsx scripts/scrape-avanture-net.ts 0 5 >> /tmp/transoglasi-avanture-net.log 2>&1
