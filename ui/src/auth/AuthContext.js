import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { buildBasicAuthHeader, fetchJson } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authHeader, setAuthHeader] = useState(null);
  const [principal, setPrincipal] = useState("");

  const login = useCallback(async (username, password) => {
    const header = buildBasicAuthHeader(username, password);
    await fetchJson("/master/state-summary", header);
    setAuthHeader(header);
    setPrincipal(username);
  }, []);

  const logout = useCallback(() => {
    setAuthHeader(null);
    setPrincipal("");
  }, []);

  const request = useCallback(async (path, options) => {
    if (!authHeader) throw new Error("Not authenticated");
    try {
      return await fetchJson(path, authHeader, options);
    } catch (error) {
      if (error.status === 401) logout();
      throw error;
    }
  }, [authHeader, logout]);

  const value = useMemo(() => ({
    authHeader,
    isAuthenticated: Boolean(authHeader),
    principal,
    login,
    logout,
    request,
  }), [authHeader, login, logout, principal, request]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
