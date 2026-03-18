const crypto = require("node:crypto");

const TOKEN_EXPIRATION_SECONDS = 60 * 60 * 8;

function getAuthSecret() {
  return process.env.AUTH_SECRET || "dev-secret-change-me";
}

function getAllowedCredentials() {
  return {
    username: process.env.AUTH_USERNAME || "admin",
    password: process.env.AUTH_PASSWORD || "admin123"
  };
}

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function signPayload(payload) {
  const encodedHeader = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const content = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(content)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${content}.${signature}`;
}

function verifyToken(token) {
  if (!token || token.split(".").length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, providedSignature] = token.split(".");
  const content = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(content)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (providedSignature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

function login(username, password) {
  const allowed = getAllowedCredentials();
  if (username !== allowed.username || password !== allowed.password) {
    return null;
  }

  const payload = {
    sub: username,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SECONDS
  };

  return {
    accessToken: signPayload(payload),
    expiresIn: TOKEN_EXPIRATION_SECONDS,
    user: {
      username,
      role: "admin"
    }
  };
}

module.exports = {
  login,
  verifyToken
};
