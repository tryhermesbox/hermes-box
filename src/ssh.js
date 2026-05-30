import { spawnSync } from "node:child_process";

export function sshCommand(host, command) {
  return [
    "ssh",
    "-o", "StrictHostKeyChecking=accept-new",
    `root@${host}`,
    command
  ];
}

export function runSsh(host, command) {
  const args = sshCommand(host, command);
  return spawnSync(args[0], args.slice(1), { stdio: "inherit" });
}
