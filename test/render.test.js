import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readInventory, writeInventory } from "../src/inventory.js";
import { renderTemplate } from "../src/render.js";

test("renderTemplate replaces placeholders", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hermes-render-"));
  const file = path.join(dir, "template.txt");
  fs.writeFileSync(file, "server={{SERVER}} port={{PORT}}\n");

  const output = renderTemplate(file, {
    SERVER: "hermes-box-01",
    PORT: 8787
  });

  assert.equal(output, "server=hermes-box-01 port=8787\n");
});

test("inventory round-trips json", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hermes-inventory-"));
  const file = path.join(dir, "state", "inventory.json");
  const data = {
    server: { id: 1, name: "hermes-box-01" },
    agent: { port: 8787 }
  };

  writeInventory(file, data);

  assert.deepEqual(readInventory(file), data);
});
