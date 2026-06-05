#!/usr/bin/env bash
set -euo pipefail

INV="${1:-.hermes-box/inventory.json}"
IP="$(node -e "const fs=require('fs'); const i=JSON.parse(fs.readFileSync(process.argv[1])); console.log(i.server.ipv4)" "$INV")"

exec ssh -o StrictHostKeyChecking=accept-new "root@$IP"
