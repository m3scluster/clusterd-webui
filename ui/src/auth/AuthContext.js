import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { buildBasicAuthHeader, fetchJson } from "../api";
import { clearAuthSession, persistAuthSession, restoreAuthSession } from "./authSession";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => restoreAuthSession());
  const authHeader = session?.authHeader || null;
  const principal = session?.principal || "";

  const login = useCallback(async (username, password) => {
    const header = buildBasicAuthHeader(username, password);
    await fetchJson("/master/state-summary", header);
    const authenticatedSession = { authHeader: header, principal: username };
    persistAuthSession(authenticatedSession);
    setSession(authenticatedSession);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
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
