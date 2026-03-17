const drawService = require("../services/drawService");

async function certifyDraw(req, res, next) {
  try {
    const record = await drawService.certifyDraw(req.file);
    res.status(201).json({
      message: "Draw certified successfully",
      data: record
    });
  } catch (error) {
    next(error);
  }
}

function getDraws(req, res, next) {
  try {
    const draws = drawService.listDraws();
    res.json({ data: draws });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  certifyDraw,
  getDraws
};
