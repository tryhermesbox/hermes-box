# Security

Self-hosted Hermes Agent servers should be treated as production infrastructure.

## Local Secrets

Do not commit:

- Hetzner API tokens
- SSH private keys
- Wallet seed phrases
- Agent runtime secrets
- Vercel or deployment tokens

## Server Firewall

The CLI creates firewall rules for:

- SSH on `22/tcp`
- Agent HTTP on `${HERMES_AGENT_PORT}/tcp`

Lock these down with:

```bash
SSH_ALLOWED_CIDR=your.ip.address/32
AGENT_ALLOWED_CIDR=your.ip.address/32
```

## Production Recommendations

- Use a dedicated SSH key for Hermes Box.
- Rotate Hetzner tokens after provisioning.
- Put the agent behind TLS before public use.
- Keep `/opt/hermes-agent/.env` readable only by root.
