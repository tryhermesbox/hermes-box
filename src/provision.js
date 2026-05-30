import fs from "node:fs";
import path from "node:path";
import { HetznerClient } from "./hetzner.js";
import { readInventory, writeInventory } from "./inventory.js";
import { renderTemplate } from "./render.js";

export async function plan(config) {
  console.log(JSON.stringify(publicPlan(config), null, 2));
}

export async function provision(config) {
  const client = new HetznerClient(config.hetznerToken);
  const sshKey = await upsertSshKey(client, config);
  const firewall = await upsertFirewall(client, config);
  const userData = renderCloudInit(config);

  const existing = await client.listServers(config.serverName);
  if (existing.servers.length > 0) {
    const server = existing.servers[0];
    const inventory = inventoryFromServer(server, sshKey, firewall, config);
    writeInventory(config.inventoryPath, inventory);
    console.log("Reusing existing server:");
    console.log(JSON.stringify(inventory, null, 2));
    return;
  }

  const result = await client.createServer({
    name: config.serverName,
    server_type: config.serverType,
    image: config.serverImage,
    location: config.serverLocation,
    ssh_keys: [sshKey.id],
    firewalls: [{ firewall: firewall.id }],
    user_data: userData,
    labels: {
      project: "hermes-box",
      role: "hermes-agent"
    }
  });

  const inventory = inventoryFromServer(result.server, sshKey, firewall, config);
  writeInventory(config.inventoryPath, inventory);
  console.log("Server created:");
  console.log(JSON.stringify(inventory, null, 2));
}

export async function status(config) {
  const inventory = readInventory(config.inventoryPath);
  if (!inventory) {
    console.log("No local inventory found. Run npm run provision first.");
    return;
  }

  const client = new HetznerClient(config.hetznerToken);
  const server = await client.getServer(inventory.server.id);
  console.log(JSON.stringify({
    local: inventory,
    hetzner: {
      id: server.server.id,
      name: server.server.name,
      status: server.server.status,
      ipv4: server.server.public_net.ipv4?.ip,
      created: server.server.created
    }
  }, null, 2));
}

export async function logs(config) {
  const inventory = readInventory(config.inventoryPath);
  if (!inventory) {
    console.log("No local inventory found.");
    return;
  }
  const ip = inventory.server.ipv4;
  console.log(`ssh root@${ip}`);
  console.log(`ssh root@${ip} 'docker compose -f /opt/hermes-agent/docker-compose.yml logs -f'`);
}

export async function destroy(config) {
  const inventory = readInventory(config.inventoryPath);
  const client = new HetznerClient(config.hetznerToken);
  const serverId = inventory?.server?.id;

  if (!serverId) {
    const existing = await client.listServers(config.serverName);
    if (existing.servers.length === 0) {
      console.log("No server found.");
      return;
    }
    await client.deleteServer(existing.servers[0].id);
    console.log(`Deleted server ${existing.servers[0].name}`);
    return;
  }

  await client.deleteServer(serverId);
  console.log(`Deleted server ${serverId}`);
}

function publicPlan(config) {
  return {
    server: {
      name: config.serverName,
      type: config.serverType,
      image: config.serverImage,
      location: config.serverLocation
    },
    network: {
      sshAllowedCidr: config.sshAllowedCidr,
      agentAllowedCidr: config.agentAllowedCidr,
      agentPort: config.agentPort
    },
    runtime: {
      image: config.agentImage,
      timezone: config.timezone
    },
    inventoryPath: config.inventoryPath
  };
}

async function upsertSshKey(client, config) {
  const name = `${config.serverName}-key`;
  const existing = await client.listSshKeys(name);
  if (existing.ssh_keys.length > 0) return existing.ssh_keys[0];
  const publicKey = fs.readFileSync(config.sshPublicKeyPath, "utf8").trim();
  const result = await client.createSshKey(name, publicKey);
  return result.ssh_key;
}

async function upsertFirewall(client, config) {
  const name = `${config.serverName}-firewall`;
  const existing = await client.listFirewalls(name);
  if (existing.firewalls.length > 0) return existing.firewalls[0];

  const result = await client.createFirewall({
    name,
    rules: [
      {
        direction: "in",
        protocol: "tcp",
        port: "22",
        source_ips: [config.sshAllowedCidr]
      },
      {
        direction: "in",
        protocol: "tcp",
        port: String(config.agentPort),
        source_ips: [config.agentAllowedCidr]
      }
    ]
  });

  return result.firewall;
}

function renderCloudInit(config) {
  const compose = renderTemplate("templates/docker-compose.yml", {
    HERMES_AGENT_IMAGE: config.agentImage,
    HERMES_AGENT_PORT: config.agentPort
  });

  const service = renderTemplate("systemd/hermes-agent.service", {});

  return renderTemplate("cloud-init/hermes-agent.yml", {
    HERMES_AGENT_TOKEN: config.agentToken,
    HERMES_AGENT_PORT: config.agentPort,
    HERMES_AGENT_TIMEZONE: config.timezone,
    DOCKER_COMPOSE_YML_B64: Buffer.from(compose).toString("base64"),
    HERMES_SERVICE_B64: Buffer.from(service).toString("base64")
  });
}

function inventoryFromServer(server, sshKey, firewall, config) {
  return {
    createdAt: new Date().toISOString(),
    server: {
      id: server.id,
      name: server.name,
      status: server.status,
      ipv4: server.public_net?.ipv4?.ip || null,
      type: config.serverType,
      location: config.serverLocation
    },
    sshKey: {
      id: sshKey.id,
      name: sshKey.name
    },
    firewall: {
      id: firewall.id,
      name: firewall.name
    },
    agent: {
      image: config.agentImage,
      port: config.agentPort,
      healthUrl: server.public_net?.ipv4?.ip ? `http://${server.public_net.ipv4.ip}:${config.agentPort}/health` : null
    }
  };
}
