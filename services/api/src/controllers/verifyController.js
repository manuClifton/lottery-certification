const drawService = require("../services/drawService");

async function verifyDraw(req, res, next) {
  try {
    const { drawHash } = req.body;
    const result = await drawService.verifyDrawByHash(drawHash);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

async function verifyDrawByDate(req, res, next) {
  try {
    const { gameType, date, shift } = req.body;
    const result = await drawService.verifyDrawByCriteria({ gameType, date, shift });
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyDraw,
  verifyDrawByDate
};
