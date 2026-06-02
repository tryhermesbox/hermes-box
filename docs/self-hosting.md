# Self-Hosting Guide

This guide deploys Hermes Agent to your own Hetzner Cloud server.

## Requirements

- Node.js 20+
- A Hetzner Cloud project
- A read/write Hetzner API token
- An SSH public key
- A Hermes Agent runtime token

## Steps

```bash
cp .env.example .env
npm install
npm run plan
npm run provision
```

After provisioning, connect to the server:

```bash
ssh root@<server-ip>
docker compose -f /opt/hermes-agent/docker-compose.yml ps
docker compose -f /opt/hermes-agent/docker-compose.yml logs -f
```

## Updating Hermes Agent

```bash
ssh root@<server-ip>
cd /opt/hermes-agent
docker compose pull
systemctl restart hermes-agent
```
