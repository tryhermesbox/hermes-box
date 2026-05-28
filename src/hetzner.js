export class HetznerClient {
  constructor(token) {
    this.token = token;
    this.baseUrl = "https://api.hetzner.cloud/v1";
  }

  async request(method, path, body) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = data.error?.message || data.message || response.statusText;
      throw new Error(`Hetzner ${method} ${path}: ${message}`);
    }

    return data;
  }

  listServers(name) {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    return this.request("GET", `/servers${query}`);
  }

  createServer(payload) {
    return this.request("POST", "/servers", payload);
  }

  deleteServer(id) {
    return this.request("DELETE", `/servers/${id}`);
  }

  listSshKeys(name) {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    return this.request("GET", `/ssh_keys${query}`);
  }

  createSshKey(name, publicKey) {
    return this.request("POST", "/ssh_keys", { name, public_key: publicKey });
  }

  listFirewalls(name) {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    return this.request("GET", `/firewalls${query}`);
  }

  createFirewall(payload) {
    return this.request("POST", "/firewalls", payload);
  }

  getServer(id) {
    return this.request("GET", `/servers/${id}`);
  }
}
