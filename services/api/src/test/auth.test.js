const test = require("node:test");
const assert = require("node:assert/strict");

const authService = require("../services/authService");

test("login returns token for valid credentials", () => {
  process.env.AUTH_USERNAME = "admin";
  process.env.AUTH_PASSWORD = "admin123";
  process.env.AUTH_SECRET = "test-secret";

  const session = authService.login("admin", "admin123");
  assert.ok(session);
  assert.ok(session.accessToken);

  const payload = authService.verifyToken(session.accessToken);
  assert.equal(payload.sub, "admin");
  assert.equal(payload.role, "admin");
});

test("login fails for invalid credentials", () => {
  process.env.AUTH_USERNAME = "admin";
  process.env.AUTH_PASSWORD = "admin123";
  process.env.AUTH_SECRET = "test-secret";

  const session = authService.login("admin", "wrong");
  assert.equal(session, null);
});
