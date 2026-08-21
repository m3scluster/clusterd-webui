import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "./auth/AuthContext";
import { deriveDashboard } from "./dashboard";
import ThemeToggle from "./app/ThemeToggle";

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      setPassword("");
    } catch (loginError) {
      setPassword("");
      setError(loginError.status === 401
        ? "Username or password is not accepted by ClusterD."
        : `ClusterD is not reachable: ${loginError.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="login-page">
      <ThemeToggle sx={{ position: "absolute", right: 20, top: 20, border: 1, borderColor: "divider", bgcolor: "background.paper" }} />
      <Paper className="login-card" elevation={8}>
        <Typography variant="overline" color="primary">Cluster administration</Typography>
        <Typography variant="h4" fontWeight={700} gutterBottom>Sign in to ClusterD</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Credentials are verified directly by the ClusterD master and kept only for this tab session.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            autoComplete="username"
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            required
            autoComplete="current-password"
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button disabled={submitting} size="large" type="submit" variant="contained">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

function CountCard({ label, value, detail, tone = "primary" }) {
  return (
    <Card className="metric-card">
      <CardContent>
        <Typography color="text.secondary" variant="body2">{label}</Typography>
        <Typography color={`${tone}.main`} variant="h3" fontWeight={700}>{value}</Typography>
        <Typography color="text.secondary" variant="caption">{detail}</Typography>
      </CardContent>
    </Card>
  );
}

function formatResource(value, kind) {
  if (kind === "CPU") return Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const units = ["MiB", "GiB", "TiB"];
  let amount = Number(value) || 0;
  let unit = 0;
  while (amount >= 1024 && unit < units.length - 1) {
    amount /= 1024;
    unit += 1;
  }
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${units[unit]}`;
}

function ResourceCard({ label, resource }) {
  return (
    <Card className="resource-card">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
          <Typography fontWeight={700}>{label}</Typography>
          <Typography color="primary" fontWeight={700}>{resource.percent.toFixed(1)}%</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={resource.percent} sx={{ my: 2, height: 8, borderRadius: 4 }} />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Used {formatResource(resource.used, label)}</Typography>
          <Typography color="text.secondary" variant="body2">Total {formatResource(resource.total, label)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { request } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [summary, state, metrics] = await Promise.all([
        request("/master/state-summary"),
        request("/state").catch(() => ({})),
        request("/metrics/snapshot"),
      ]);
      setDashboard(deriveDashboard(summary, state, metrics));
      setUpdatedAt(new Date());
      setError("");
    } catch (refreshError) {
      setError(refreshError.message || "Dashboard data could not be loaded.");
    } finally {
      setRefreshing(false);
    }
  }, [request]);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  if (!dashboard && refreshing) return <Box className="centered"><CircularProgress /></Box>;
  if (!dashboard) return <Alert severity="error">{error}</Alert>;

  const { cluster, counts, resources, monitoring } = dashboard;
  return (
    <Stack spacing={3}>
      {error && <Alert severity="warning">Refresh failed: {error}. Showing the last successful snapshot.</Alert>}
      <Paper className="cluster-hero" elevation={0}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h4" fontWeight={700}>{cluster.name}</Typography>
              <Chip color={cluster.healthy ? "success" : "warning"} label={cluster.healthy ? "Leader elected" : "No elected leader"} size="small" />
            </Stack>
            <Typography color="text.secondary">{cluster.hostname} · Mesos {cluster.version}</Typography>
            <Typography color="text.secondary" variant="body2">Leader: {cluster.leader}</Typography>
          </Box>
          <Box textAlign={{ md: "right" }}>
            <Typography variant="h5" fontWeight={700}>{cluster.uptime}</Typography>
            <Typography color="text.secondary" variant="body2">Master uptime</Typography>
            <Typography color="text.secondary" variant="caption">
              {refreshing ? "Refreshing…" : `Updated ${updatedAt?.toLocaleTimeString()}`}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box>
        <Typography className="section-title" variant="h6">Workloads</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}><CountCard label="Active agents" value={counts.agents} detail={`${counts.unreachableAgents} unreachable`} /></Grid>
          <Grid item xs={6} md={3}><CountCard label="Active frameworks" value={counts.frameworks} detail={`${counts.connectedFrameworks} connected`} /></Grid>
          <Grid item xs={6} md={3}><CountCard label="Running tasks" value={counts.runningTasks} detail={`${counts.pendingTasks} pending`} tone="success" /></Grid>
          <Grid item xs={6} md={3}><CountCard label="Failed tasks" value={counts.failedTasks} detail={`${counts.finishedTasks} finished`} tone={counts.failedTasks ? "error" : "success"} /></Grid>
        </Grid>
      </Box>

      <Box>
        <Typography className="section-title" variant="h6">Cluster capacity</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><ResourceCard label="CPU" resource={resources.cpu} /></Grid>
          <Grid item xs={12} md={4}><ResourceCard label="Memory" resource={resources.memory} /></Grid>
          <Grid item xs={12} md={4}><ResourceCard label="Disk" resource={resources.disk} /></Grid>
        </Grid>
      </Box>

      <Box>
        <Typography className="section-title" variant="h6">Control plane monitoring</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}><CountCard label="Queued messages" value={monitoring.queuedMessages} detail={`${monitoring.queuedHttpRequests} HTTP requests queued`} /></Grid>
          <Grid item xs={6} md={3}><CountCard label="Outstanding offers" value={monitoring.outstandingOffers} detail={`${monitoring.dispatches.toLocaleString()} dispatches`} /></Grid>
          <Grid item xs={6} md={3}><CountCard label="Allocator p95" value={`${monitoring.allocatorP95.toFixed(1)} ms`} detail="Allocation run latency" /></Grid>
          <Grid item xs={6} md={3}><CountCard label="System load" value={monitoring.load1m.toFixed(2)} detail={`5 min ${monitoring.load5m.toFixed(2)} · ${monitoring.droppedMessages} dropped messages`} /></Grid>
        </Grid>
      </Box>
    </Stack>
  );
}

export { AuthProvider, useAuth } from "./auth/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <Login />;
}
