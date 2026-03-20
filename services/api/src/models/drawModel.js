const draws = [];

function listDraws() {
  return draws;
}

function findByHash(drawHash) {
  return draws.find((draw) => draw.drawHash === drawHash) || null;
}

function findByCriteria({ gameType, date, shift }) {
  return (
    draws.find((draw) => {
      if (draw.gameType !== gameType) {
        return false;
      }

      if (draw.date !== date) {
        return false;
      }

      if (gameType === "quiniela") {
        return draw.shift === shift;
      }

      return true;
    }) || null
  );
}

function createDraw(entry) {
  const record = {
    id: draws.length + 1,
    ...entry,
    createdAt: new Date().toISOString()
  };

  draws.push(record);
  return record;
}

function clearDraws() {
  draws.length = 0;
}

module.exports = {
  listDraws,
  findByHash,
  findByCriteria,
  createDraw,
  clearDraws
};
