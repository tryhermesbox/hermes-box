# Firewall

The provisioning command creates a Hetzner firewall attached to the server.

## Defaults

| Port | Protocol | Purpose |
| --- | --- | --- |
| 22 | TCP | SSH access |
| 8787 | TCP | Hermes Agent HTTP |

## Recommended Production Values

```bash
SSH_ALLOWED_CIDR=your.ip.address/32
AGENT_ALLOWED_CIDR=your.ip.address/32
```

For public agent endpoints, put the server behind a reverse proxy with TLS and keep the raw agent port restricted.
