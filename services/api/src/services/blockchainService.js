const crypto = require("node:crypto");

function generateSha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function buildMockTxHash(drawHash) {
  return `0x${crypto.createHash("sha256").update(`tx:${drawHash}`).digest("hex")}`;
}

async function certifyHashOnChain(drawHash) {
  return {
    transactionHash: buildMockTxHash(drawHash)
  };
}

async function verifyHashOnChain() {
  return true;
}

module.exports = {
  generateSha256,
  certifyHashOnChain,
  verifyHashOnChain
};
