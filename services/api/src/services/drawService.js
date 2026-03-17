const AppError = require("../errores/AppError");
const drawModel = require("../models/drawModel");
const blockchainService = require("./blockchainService");

async function certifyDraw(file) {
  if (!file || !file.buffer) {
    throw new AppError("TXT file is required", 400);
  }

  const drawHash = blockchainService.generateSha256(file.buffer);
  const existing = drawModel.findByHash(drawHash);

  if (existing) {
    throw new AppError("Draw already certified", 409);
  }

  const tx = await blockchainService.certifyHashOnChain(drawHash);

  return drawModel.createDraw({
    fileName: file.originalname,
    drawHash,
    transactionHash: tx.transactionHash
  });
}

async function verifyDrawByHash(drawHash) {
  if (!drawHash) {
    throw new AppError("drawHash is required", 400);
  }

  const localRecord = drawModel.findByHash(drawHash);
  const existsOnChain = localRecord
    ? true
    : await blockchainService.verifyHashOnChain(drawHash);

  return {
    drawHash,
    certified: Boolean(localRecord && existsOnChain),
    transactionHash: localRecord ? localRecord.transactionHash : null
  };
}

function listDraws() {
  return drawModel.listDraws();
}

module.exports = {
  certifyDraw,
  verifyDrawByHash,
  listDraws
};
