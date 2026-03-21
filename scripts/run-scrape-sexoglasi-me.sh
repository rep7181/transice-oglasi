#!/bin/bash
cd /Users/martin/transoglasi
export PATH="/usr/local/bin:$PATH"
npx tsx scripts/scrape-sexoglasi-me.ts 0 5 >> /tmp/transoglasi-sexoglasi-me.log 2>&1
