# Troubleshooting

## Server Created But SSH Fails

- Wait for cloud-init to finish.
- Check that your public key path was correct.
- Confirm `SSH_ALLOWED_CIDR` includes your current IP.

## Agent Port Does Not Respond

```bash
ssh root@<server-ip> 'systemctl status hermes-agent --no-pager'
ssh root@<server-ip> 'docker compose -f /opt/hermes-agent/docker-compose.yml ps'
ssh root@<server-ip> 'docker compose -f /opt/hermes-agent/docker-compose.yml logs --tail=100'
```

## Hetzner API Errors

- Confirm the token has read/write access.
- Confirm the selected server type exists in the selected location.
- Confirm the project quota allows another server.
