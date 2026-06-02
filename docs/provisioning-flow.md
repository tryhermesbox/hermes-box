# Provisioning Flow

The CLI orchestration is intentionally small and auditable.

## Flow

1. Load `.env`.
2. Validate required values.
3. Create or reuse SSH key.
4. Create or reuse firewall.
5. Render cloud-init.
6. Create server.
7. Write `.hermes-box/inventory.json`.

## Inventory

The inventory file stores the server id, public IP, firewall id, SSH key id, and agent health URL. It is local state and should not be committed.
