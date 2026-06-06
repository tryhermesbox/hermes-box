#!/usr/bin/env bash
set -euo pipefail

INV="${1:-.hermes-box/inventory.json}"
URL="$(node -e "const fs=require('fs'); const i=JSON.parse(fs.readFileSync(process.argv[1])); console.log(i.agent.healthUrl)" "$INV")"

curl -fsS "$URL"
echo
