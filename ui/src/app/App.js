import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Menu from "./Menu";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "../auth/AuthContext";
import "./App.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#326ce5" },
    background: { default: "#f4f6f8" },
  },
  shape: { borderRadius: 8 },
  typography: { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Menu />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
