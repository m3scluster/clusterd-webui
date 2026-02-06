// Home.js
import React, { createContext, useContext, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

// ---------------------- AuthContext ----------------------
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authHeader, setAuthHeader] = useState(null);

  const login = (username, password) => {
    const header = "Basic " + btoa(`${username}:${password}`);
    setAuthHeader(header);
  };

  return (
    <AuthContext.Provider value={{ authHeader, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

// ---------------------- Home Component ----------------------
export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const { authHeader, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Header global speichern
    login(username, password);

    try {
      const response = await fetch("https://172.30.96.0:5050/slaves", {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      if (!response.ok) throw new Error("Login Error!");

      const result = await response.json();
    } catch (err) {
    }
  };

  return (
    <Box sx={{ mt: 3, ml: 3, width: "90%", maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Login & Fetch Data
        </Button>
      </form>

      {authHeader && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1">Header gespeichert!</Typography>
          {data && (
            <Box sx={{ mt: 2 }}>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

