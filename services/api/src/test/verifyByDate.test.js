const test = require("node:test");
const assert = require("node:assert/strict");

const drawModel = require("../models/drawModel");
const drawService = require("../services/drawService");

test.beforeEach(() => {
  drawModel.clearDraws();
});

test("verifyDrawByCriteria returns certified true for quiniela with shift", async () => {
  drawModel.createDraw({
    fileName: "q-2026-03-20.txt",
    drawHash: "hash-quiniela-1",
    transactionHash: "tx-quiniela-1",
    gameType: "quiniela",
    date: "2026-03-20",
    shift: "vespertina"
  });

  const result = await drawService.verifyDrawByCriteria({
    gameType: "quiniela",
    date: "2026-03-20",
    shift: "vespertina"
  });

  assert.equal(result.certified, true);
  assert.equal(result.drawHash, "hash-quiniela-1");
  assert.equal(result.transactionHash, "tx-quiniela-1");
  assert.equal(result.gameType, "quiniela");
  assert.equal(result.date, "2026-03-20");
  assert.equal(result.shift, "vespertina");
});

test("verifyDrawByCriteria returns certified true for telebingo with date only", async () => {
  drawModel.createDraw({
    fileName: "t-2026-03-20.txt",
    drawHash: "hash-telebingo-1",
    transactionHash: "tx-telebingo-1",
    gameType: "telebingo",
    date: "2026-03-20"
  });

  const result = await drawService.verifyDrawByCriteria({
    gameType: "telebingo",
    date: "2026-03-20"
  });

  assert.equal(result.certified, true);
  assert.equal(result.drawHash, "hash-telebingo-1");
  assert.equal(result.transactionHash, "tx-telebingo-1");
  assert.equal(result.gameType, "telebingo");
  assert.equal(result.date, "2026-03-20");
  assert.equal(result.shift, null);
});

test("verifyDrawByCriteria returns certified false when not found", async () => {
  const result = await drawService.verifyDrawByCriteria({
    gameType: "rebingo",
    date: "2026-03-20"
  });

  assert.equal(result.certified, false);
  assert.equal(result.drawHash, null);
  assert.equal(result.transactionHash, null);
  assert.equal(result.gameType, "rebingo");
  assert.equal(result.date, "2026-03-20");
  assert.equal(result.shift, null);
});

test("verifyDrawByCriteria rejects quiniela without shift", async () => {
  await assert.rejects(
    () =>
      drawService.verifyDrawByCriteria({
        gameType: "quiniela",
        date: "2026-03-20"
      }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.match(error.message, /shift is required/);
      return true;
    }
  );
});

test("verifyDrawByCriteria rejects invalid gameType", async () => {
  await assert.rejects(
    () =>
      drawService.verifyDrawByCriteria({
        gameType: "loto",
        date: "2026-03-20"
      }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.match(error.message, /gameType is required/);
      return true;
    }
  );
});

test("verifyDrawByCriteria rejects invalid date format", async () => {
  await assert.rejects(
    () =>
      drawService.verifyDrawByCriteria({
        gameType: "minibingo",
        date: "20-03-2026"
      }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.match(error.message, /date is required/);
      return true;
    }
  );
});
