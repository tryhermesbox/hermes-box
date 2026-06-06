# Operations

Hermes Box self-host servers are designed to be managed with standard Linux and Docker tooling.

## Connect

```bash
scripts/connect.sh .hermes-box/inventory.json
```

## Logs

```bash
ssh root@<server-ip> 'docker compose -f /opt/hermes-agent/docker-compose.yml logs -f'
```

## Restart

```bash
ssh root@<server-ip> 'systemctl restart hermes-agent'
```

## Health

```bash
scripts/healthcheck.sh .hermes-box/inventory.json
```

## Backups

Back up `/opt/hermes-agent/data` and `/opt/hermes-agent/.env` before changing runtime images.
