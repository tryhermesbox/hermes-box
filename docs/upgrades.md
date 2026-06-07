# Upgrades

Hermes Agent runs as a Docker Compose service on the server.

## Upgrade Runtime Image

```bash
ssh root@<server-ip>
cd /opt/hermes-agent
docker compose pull
systemctl restart hermes-agent
```

## Change Image Channel

Update `HERMES_AGENT_IMAGE` locally, then reprovision or edit `/opt/hermes-agent/docker-compose.yml` on the host.

## Rollback

Pin the previous image tag and restart the service:

```bash
docker compose pull
systemctl restart hermes-agent
```
