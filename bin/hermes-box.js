#!/usr/bin/env node

import { loadConfig } from "../src/config.js";
import { destroy, logs, plan, provision, status } from "../src/provision.js";

const command = process.argv[2] || "help";
const config = loadConfig();

const commands = {
  plan,
  provision,
  status,
  logs,
  destroy
};

if (command === "help" || command === "--help" || command === "-h") {
  console.log(`Hermes Box self-host CLI

Usage:
  hermes-box plan
  hermes-box provision
  hermes-box status
  hermes-box logs
  hermes-box destroy
`);
  process.exit(0);
}

if (!commands[command]) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

commands[command](config).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
