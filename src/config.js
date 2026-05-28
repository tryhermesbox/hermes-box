import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function loadConfig() {
  loadDotEnv();

  const config = {
    hetznerToken: required("HETZNER_TOKEN"),
    serverName: env("SERVER_NAME", "hermes-box-01"),
    serverType: env("SERVER_TYPE", "cx22"),
    serverImage: env("SERVER_IMAGE", "ubuntu-24.04"),
    serverLocation: env("SERVER_LOCATION", "fsn1"),
    sshPublicKeyPath: expandHome(env("SSH_PUBLIC_KEY_PATH", "~/.ssh/id_ed25519.pub")),
    sshAllowedCidr: env("SSH_ALLOWED_CIDR", "0.0.0.0/0"),
    agentAllowedCidr: env("AGENT_ALLOWED_CIDR", "0.0.0.0/0"),
    agentImage: env("HERMES_AGENT_IMAGE", "ghcr.io/tryhermesbox/hermes-agent:latest"),
    agentToken: required("HERMES_AGENT_TOKEN"),
    agentPort: Number(env("HERMES_AGENT_PORT", "8787")),
    timezone: env("HERMES_AGENT_TIMEZONE", "UTC"),
    inventoryPath: env("INVENTORY_PATH", ".hermes-box/inventory.json")
  };

  if (!fs.existsSync(config.sshPublicKeyPath)) {
    throw new Error(`SSH public key not found: ${config.sshPublicKeyPath}`);
  }

  return config;
}

function env(name, fallback) {
  return process.env[name] || fallback;
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function expandHome(value) {
  if (!value.startsWith("~")) return value;
  return path.join(os.homedir(), value.slice(1));
}

function loadDotEnv() {
  const file = path.resolve(".env");
  if (!fs.existsSync(file)) return;

  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
