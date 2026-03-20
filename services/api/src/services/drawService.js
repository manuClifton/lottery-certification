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

function isAllowedGameType(gameType) {
  return ["quiniela", "telebingo", "minibingo", "rebingo"].includes(gameType);
}

function isAllowedShift(shift) {
  return ["matutina", "vespertina", "nocturna"].includes(shift);
}

function validateDateString(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

async function verifyDrawByCriteria({ gameType, date, shift }) {
  if (!isAllowedGameType(gameType)) {
    throw new AppError("gameType is required and must be one of: quiniela, telebingo, minibingo, rebingo", 400);
  }

  if (!date || !validateDateString(date)) {
    throw new AppError("date is required and must have YYYY-MM-DD format", 400);
  }

  if (gameType === "quiniela") {
    if (!isAllowedShift(shift)) {
      throw new AppError("shift is required for quiniela and must be one of: matutina, vespertina, nocturna", 400);
    }
  }

  const localRecord = drawModel.findByCriteria({ gameType, date, shift });

  return {
    certified: Boolean(localRecord),
    drawHash: localRecord ? localRecord.drawHash : null,
    transactionHash: localRecord ? localRecord.transactionHash : null,
    gameType,
    date,
    shift: gameType === "quiniela" ? shift : null
  };
}

function listDraws() {
  return drawModel.listDraws();
}

module.exports = {
  certifyDraw,
  verifyDrawByHash,
  verifyDrawByCriteria,
  listDraws
};
