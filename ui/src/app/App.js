import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Logo from "./Logo";
import Menu from "./Menu";
import Tasks from "../features/tasks";
import Home, { AuthProvider } from "../Home";
import "./App.css";


function App() {
  return (
    <div>
      <CssBaseline />
      <AuthProvider>
        <Logo />
        <Menu />
      </AuthProvider>
    </div>
  );
}

export default App;
