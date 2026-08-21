import React from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TerminalIcon from "@mui/icons-material/Terminal";
import LogViewerDialog from "../logs/LogViewerDialog";
import {
  agentAdvancedDetails,
  agentResourceStats,
  formatAgentResource,
  formatAgentTimestamp,
} from "./agentDetails";

const EMPTY = "—";

function DetailField({ label, children, mono = false }) {
  return (
    <Box>
      <Typography color="text.secondary" variant="caption">{label}</Typography>
      <Typography
        component="div"
        fontFamily={mono ? "monospace" : "inherit"}
        fontWeight={500}
        sx={{ mt: 0.25, overflowWrap: "anywhere" }}
      >
        {children ?? EMPTY}
      </Typography>
    </Box>
  );
}

function ResourceCard({ agent, name, label }) {
  const stats = agentResourceStats(agent, name);
  const value = (number) => formatAgentResource(name, number);

  return (
    <Paper variant="outlined" sx={{ height: "100%", p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography fontWeight={700}>{label}</Typography>
        <Typography color="primary" fontWeight={700}>{stats.utilization.toFixed(1)}%</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={stats.utilization} sx={{ my: 1.5, height: 7, borderRadius: 4 }} />
      <Grid container spacing={1.5}>
        <Grid item xs={6}><DetailField label="Total">{value(stats.total)}</DetailField></Grid>
        <Grid item xs={6}><DetailField label="Used">{value(stats.used)}</DetailField></Grid>
        <Grid item xs={6}><DetailField label="Offered">{value(stats.offered)}</DetailField></Grid>
        <Grid item xs={6}><DetailField label="Available">{value(stats.available)}</DetailField></Grid>
      </Grid>
    </Paper>
  );
}

function agentStatus(agent) {
  if (agent?.active) return { label: "Active", color: "success" };
  if (agent?.deactivated) return { label: "Deactivated", color: "warning" };
  return { label: "Inactive", color: "default" };
}

export default function AgentDetailsDialog({ open, agent, onClose }) {
  const [logsOpen, setLogsOpen] = React.useState(false);
  const status = agentStatus(agent);
  const advanced = agentAdvancedDetails(agent);
  const attributes = Object.entries(agent?.attributes || {});
  const capabilities = Array.isArray(agent?.capabilities) ? agent.capabilities : [];

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle sx={{ pr: 7 }}>
        <Typography variant="overline" color="primary.light">Agent details</Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Typography variant="h5" fontWeight={700} sx={{ overflowWrap: "anywhere" }}>
            {agent?.hostname || agent?.id || "Agent"}
          </Typography>
          {agent && <Chip label={status.label} color={status.color} size="small" />}
        </Stack>
        <IconButton aria-label="Close agent details" onClick={onClose} sx={{ position: "absolute", right: 12, top: 16 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {!agent ? (
          <Typography color="text.secondary">No agent details available.</Typography>
        ) : (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Overview</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Status"><Chip label={status.label} color={status.color} size="small" /></DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Mesos version">{agent.version || EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Host and port">{agent.hostname ? `${agent.hostname}:${agent.port || EMPTY}` : EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="PID" mono>{agent.pid || EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6}><DetailField label="Registered">{formatAgentTimestamp(agent.registered_time)}</DetailField></Grid>
                <Grid item xs={12} sm={6}><DetailField label="Reregistered">{formatAgentTimestamp(agent.reregistered_time)}</DetailField></Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Identifier</Typography>
              <DetailField label="Agent ID" mono>{agent.id || EMPTY}</DetailField>
              <Button startIcon={<TerminalIcon />} variant="outlined" sx={{ mt: 2 }} onClick={() => setLogsOpen(true)}>View agent log</Button>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Resources & utilization</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={3}><ResourceCard agent={agent} name="cpus" label="CPU" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><ResourceCard agent={agent} name="mem" label="Memory" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><ResourceCard agent={agent} name="disk" label="Disk" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><ResourceCard agent={agent} name="gpus" label="GPUs" /></Grid>
              </Grid>
              <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={6}><DetailField label="Available port range" mono>{formatAgentResource("ports", agent.resources?.ports)}</DetailField></Grid>
                <Grid item xs={12} md={6}><DetailField label="Used ports" mono>{formatAgentResource("ports", agent.used_resources?.ports)}</DetailField></Grid>
              </Grid>
            </Box>

            <Divider />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Attributes</Typography>
                {attributes.length ? (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      {attributes.map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}><DetailField label={key}>{typeof value === "object" ? JSON.stringify(value) : String(value)}</DetailField></Grid>
                      ))}
                    </Grid>
                  </Paper>
                ) : <Typography color="text.secondary">No attributes defined.</Typography>}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Capabilities</Typography>
                {capabilities.length ? (
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {capabilities.map((capability) => <Chip key={capability} label={capability} size="small" />)}
                  </Stack>
                ) : <Typography color="text.secondary">No capabilities reported.</Typography>}
              </Grid>
            </Grid>

            <Box component="details" className="advanced-details">
              <Box component="summary">Advanced resource data</Box>
              <Box component="pre">{JSON.stringify(advanced, null, 2)}</Box>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
    <LogViewerDialog
      open={logsOpen}
      onClose={() => setLogsOpen(false)}
      kind="agent"
      title={`${agent?.hostname || agent?.id || "Agent"} log`}
      agent={agent}
    />
    </>
  );
}
