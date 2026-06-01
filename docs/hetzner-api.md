# Hetzner API

Hermes Box uses the Hetzner Cloud API to provision self-hosted Hermes Agent servers.

## Token

Create a project token in the Hetzner Cloud Console:

1. Open the target project.
2. Go to Security -> API Tokens.
3. Create a read/write token.
4. Put it in `.env` as `HETZNER_TOKEN`.

## Resources

The CLI creates or reuses:

- SSH key named `${SERVER_NAME}-key`
- Firewall named `${SERVER_NAME}-firewall`
- Server named `${SERVER_NAME}`

## Server Defaults

```bash
SERVER_TYPE=cx22
SERVER_IMAGE=ubuntu-24.04
SERVER_LOCATION=fsn1
```

Use `nbg1`, `fsn1`, or `hel1` depending on the region you want.
