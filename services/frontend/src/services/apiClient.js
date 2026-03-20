import { getToken } from "../utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error("No se pudo conectar con la API. Verifica tu conexion o que el servidor este activo");
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json?.error?.message || "La solicitud fallo");
  }

  return json.data;
}

export function login(username, password) {
  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });
}

export function verifyDraw(drawHash) {
  return request("/verify-draw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ drawHash })
  });
}

export function getDraws() {
  return request("/draws", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
}

export function certifyDraw(file) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/certify-draw", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });
}
