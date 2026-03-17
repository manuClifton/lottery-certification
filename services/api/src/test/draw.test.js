const test = require("node:test");
const assert = require("node:assert/strict");

const blockchainService = require("../services/blockchainService");

test("generateSha256 returns deterministic hash", () => {
  const buffer = Buffer.from("example draw content");
  const hashA = blockchainService.generateSha256(buffer);
  const hashB = blockchainService.generateSha256(buffer);

  assert.equal(hashA.length, 64);
  assert.equal(hashA, hashB);
});
