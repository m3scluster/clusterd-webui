import React from "react";
import CloseIcon from "@mui/icons-material/Close";
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
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  formatFrameworkResource,
  formatFrameworkTimestamp,
  frameworkAdvancedDetails,
  frameworkRoles,
  frameworkStatus,
  frameworkTaskCounts,
  frameworkWebUiUrl,
} from "./frameworkDetails";

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

function ResourceTile({ framework, name, label }) {
  return (
    <Paper variant="outlined" sx={{ height: "100%", p: 2 }}>
      <Typography color="text.secondary" variant="caption">{label}</Typography>
      <Typography variant="h6" fontWeight={700}>{formatFrameworkResource(name, framework.resources?.[name])}</Typography>
      <Grid container spacing={1} sx={{ mt: 0.5 }}>
        <Grid item xs={6}><DetailField label="Used">{formatFrameworkResource(name, framework.used_resources?.[name])}</DetailField></Grid>
        <Grid item xs={6}><DetailField label="Offered">{formatFrameworkResource(name, framework.offered_resources?.[name])}</DetailField></Grid>
      </Grid>
    </Paper>
  );
}

export default function FrameworkDetailsDialog({ open, framework, onClose }) {
  const status = frameworkStatus(framework);
  const counts = frameworkTaskCounts(framework);
  const roles = frameworkRoles(framework);
  const capabilities = Array.isArray(framework?.capabilities) ? framework.capabilities : [];
  const webUiUrl = frameworkWebUiUrl(framework?.webui_url);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle sx={{ pr: 7 }}>
        <Typography variant="overline" color="primary.light">Framework details</Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Typography variant="h5" fontWeight={700} sx={{ overflowWrap: "anywhere" }}>
            {framework?.name || framework?.id || "Framework"}
          </Typography>
          {framework && <Chip label={status.label} color={status.color} size="small" />}
        </Stack>
        <IconButton aria-label="Close framework details" onClick={onClose} sx={{ position: "absolute", right: 12, top: 16 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {!framework ? (
          <Typography color="text.secondary">No framework details available.</Typography>
        ) : (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Overview</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Status"><Chip label={status.label} color={status.color} size="small" /></DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Host">{framework.hostname || EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="User">{framework.user || EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Principal">{framework.principal || EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={4}><DetailField label="Registered">{formatFrameworkTimestamp(framework.registered_time)}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={4}><DetailField label="Reregistered">{formatFrameworkTimestamp(framework.reregistered_time)}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={4}><DetailField label="Unregistered">{formatFrameworkTimestamp(framework.unregistered_time)}</DetailField></Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Identifiers & configuration</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12}><DetailField label="Framework ID" mono>{framework.id || EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Checkpointing">{framework.checkpoint === true ? "Enabled" : framework.checkpoint === false ? "Disabled" : EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Failover timeout">{Number.isFinite(Number(framework.failover_timeout)) ? `${Number(framework.failover_timeout).toLocaleString()} s` : EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Recovered">{framework.recovered === true ? "Yes" : framework.recovered === false ? "No" : EMPTY}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Connected">{framework.connected === true ? "Yes" : framework.connected === false ? "No" : EMPTY}</DetailField></Grid>
              </Grid>
              {webUiUrl && (
                <Button component="a" href={webUiUrl} target="_blank" rel="noopener noreferrer" variant="outlined" sx={{ mt: 2 }}>
                  Open framework Web UI
                </Button>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Resources & utilization</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={3}><ResourceTile framework={framework} name="cpus" label="CPU" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><ResourceTile framework={framework} name="mem" label="Memory" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><ResourceTile framework={framework} name="disk" label="Disk" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><ResourceTile framework={framework} name="gpus" label="GPUs" /></Grid>
                <Grid item xs={12}><DetailField label="Allocated ports" mono>{formatFrameworkResource("ports", framework.resources?.ports)}</DetailField></Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Workload</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}><Paper variant="outlined" sx={{ p: 2 }}><DetailField label="Active tasks">{counts.active}</DetailField></Paper></Grid>
                <Grid item xs={6} md={3}><Paper variant="outlined" sx={{ p: 2 }}><DetailField label="Completed tasks">{counts.completed}</DetailField></Paper></Grid>
                <Grid item xs={6} md={3}><Paper variant="outlined" sx={{ p: 2 }}><DetailField label="Unreachable tasks">{counts.unreachable}</DetailField></Paper></Grid>
                <Grid item xs={6} md={3}><Paper variant="outlined" sx={{ p: 2 }}><DetailField label="Executors">{counts.executors}</DetailField></Paper></Grid>
              </Grid>
            </Box>

            <Divider />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Roles</Typography>
                {roles.length ? (
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {roles.map((role) => <Chip key={role} label={role} size="small" />)}
                  </Stack>
                ) : <Typography color="text.secondary">No roles reported.</Typography>}
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
              <Box component="summary">Advanced framework data</Box>
              <Box component="pre">{JSON.stringify(frameworkAdvancedDetails(framework), null, 2)}</Box>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}
