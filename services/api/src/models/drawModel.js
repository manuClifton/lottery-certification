const draws = [];

function listDraws() {
  return draws;
}

function findByHash(drawHash) {
  return draws.find((draw) => draw.drawHash === drawHash) || null;
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

module.exports = {
  listDraws,
  findByHash,
  createDraw
};
