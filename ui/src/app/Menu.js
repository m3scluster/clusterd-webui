import { useEffect, useState } from "react";
import { AppBar, Box, Button, Container, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import Tasks from "../features/tasks/Tasks";
import Agents from "../features/agent/Agents";
import Home from "../Home";
import Frameworks from "../features/frameworks/Frameworks";
import ClusterInfo from "../ClusterInfo";
import Logo from "./Logo";
import { useAuth } from "../auth/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { hashFromTabValue, tabValueFromHash } from "./hashNavigation";

export default function MainMenu() {
  const [tabValue, setTabValue] = useState(() => tabValueFromHash(window.location.hash));
  const { isAuthenticated, logout, principal } = useAuth();

  useEffect(() => {
    const updateActiveTabFromHash = () => setTabValue(tabValueFromHash(window.location.hash));
    window.addEventListener("hashchange", updateActiveTabFromHash);
    return () => window.removeEventListener("hashchange", updateActiveTabFromHash);
  }, []);

  const handleTabsChange = (event, value) => {
    setTabValue(value);
  };

  if (!isAuthenticated) return <Home />;

  return (
    <Box minHeight="100vh">
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Logo />
          <Box flexGrow={1} />
          <Stack direction="row" spacing={2} alignItems="center">
            <ThemeToggle />
            <Typography variant="body2">{principal}</Typography>
            <Button color="inherit" onClick={logout}>Sign out</Button>
          </Stack>
        </Toolbar>
        <Tabs
          value={tabValue}
          onChange={handleTabsChange}
          textColor="inherit"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          className="main-tabs"
        >
          <Tab label="Overview" value={0} href={hashFromTabValue(0)} />
          <Tab label="Tasks" value={1} href={hashFromTabValue(1)} />
          <Tab label="Frameworks" value={2} href={hashFromTabValue(2)} />
          <Tab label="Agents" value={3} href={hashFromTabValue(3)} />
          <Tab label="Master details" value={4} href={hashFromTabValue(4)} />
        </Tabs>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {tabValue === 0 && <Home />}
        {tabValue === 1 && <Tasks />}
        {tabValue === 2 && <Frameworks />}
        {tabValue === 3 && <Agents />}
        {tabValue === 4 && <ClusterInfo />}
      </Container>
    </Box>
  );
}
