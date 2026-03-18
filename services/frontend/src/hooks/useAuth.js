import { useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "../utils/storage";
import { login as loginRequest } from "../services/apiClient";

export function useAuth() {
  const [token, setTokenState] = useState(getToken());
  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  async function login(username, password) {
    const session = await loginRequest(username, password);
    setToken(session.accessToken);
    setTokenState(session.accessToken);
    return session;
  }

  function logout() {
    clearToken();
    setTokenState(null);
  }

  return {
    token,
    isAuthenticated,
    login,
    logout
  };
}
