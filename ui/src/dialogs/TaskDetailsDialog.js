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
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TerminalIcon from "@mui/icons-material/Terminal";
import LogViewerDialog from "../logs/LogViewerDialog";
import TaskShellDialog from "../shell/TaskShellDialog";
import { latestTaskContainerId } from "../logs/logApi";
import {
  formatTaskResource,
  formatTaskTimestamp,
  normalizeTaskRoles,
  sortTaskStatuses,
  taskAdvancedDetails,
  taskHealth,
  taskHost,
  taskSandboxHref,
} from "./taskDetails";

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
        {children || EMPTY}
      </Typography>
    </Box>
  );
}

function ResourceTile({ label, allocated, limit }) {
  return (
    <Paper variant="outlined" sx={{ height: "100%", p: 2 }}>
      <Typography color="text.secondary" variant="caption">{label}</Typography>
      <Typography variant="h6" fontWeight={700}>{allocated}</Typography>
      {limit !== EMPTY && <Typography color="text.secondary" variant="body2">Limit {limit}</Typography>}
    </Paper>
  );
}

export default function TaskDetailsDialog({ open, task, onClose }) {
  const [logsOpen, setLogsOpen] = React.useState(false);
  const [shellOpen, setShellOpen] = React.useState(false);
  const statuses = sortTaskStatuses(task?.statuses);
  const advanced = taskAdvancedDetails(task);
  const latestState = task?.state || statuses.at(-1)?.state || EMPTY;
  const sandboxHref = taskSandboxHref(task);
  const canReadLogs = Boolean(task?._agent && latestTaskContainerId(task));
  const canOpenShell = canReadLogs && Boolean(task?._agent?.hostname && task?._agent?.port);

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle sx={{ pr: 7 }}>
        <Typography variant="overline" color="primary.light">Task details</Typography>
        <Typography variant="h5" fontWeight={700} sx={{ overflowWrap: "anywhere" }}>
          {task?.name || task?.id || "Task"}
        </Typography>
        <IconButton aria-label="Close task details" onClick={onClose} sx={{ position: "absolute", right: 12, top: 16 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {!task ? (
          <Typography color="text.secondary">No task details available.</Typography>
        ) : (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Overview</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={3}><DetailField label="State"><Chip size="small" color={latestState === "TASK_RUNNING" ? "success" : "default"} label={latestState.replace("TASK_", "")} /></DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Health">{taskHealth(task)}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Role">{normalizeTaskRoles(task.role)}</DetailField></Grid>
                <Grid item xs={12} sm={6} md={3}><DetailField label="Statuses">{statuses.length}</DetailField></Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Identifiers</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12}><DetailField label="Task ID" mono>{task.id}</DetailField></Grid>
                <Grid item xs={12} md={3}><DetailField label="Framework ID" mono>{task.framework_id}</DetailField></Grid>
                <Grid item xs={12} md={3}><DetailField label="Agent ID" mono>{task.slave_id}</DetailField></Grid>
                <Grid item xs={12} md={3}><DetailField label="Host">{taskHost(task)}</DetailField></Grid>
                <Grid item xs={12} md={3}><DetailField label="Executor ID" mono>{task.executor_id}</DetailField></Grid>
                <Grid item xs={12}><DetailField label="Sandbox">{sandboxHref ? <Link href={sandboxHref}>Open sandbox</Link> : EMPTY}</DetailField></Grid>
                <Grid item xs={12}>
                  <Button startIcon={<TerminalIcon />} variant="outlined" disabled={!canReadLogs} onClick={() => setLogsOpen(true)}>
                    View task logs
                  </Button>
                  <Button variant="outlined" disabled={!canOpenShell} onClick={() => setShellOpen(true)}>
                    Open task shell
                  </Button>
                  {!canReadLogs && <Typography color="text.secondary" variant="caption" sx={{ ml: 1 }}>No active container log is available.</Typography>}
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Resources & limits</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}><ResourceTile label="CPU" allocated={formatTaskResource("cpus", task.resources?.cpus)} limit={formatTaskResource("cpus", task.limits?.cpus)} /></Grid>
                <Grid item xs={6} md={3}><ResourceTile label="Memory" allocated={formatTaskResource("mem", task.resources?.mem)} limit={formatTaskResource("mem", task.limits?.mem)} /></Grid>
                <Grid item xs={6} md={3}><ResourceTile label="Disk" allocated={formatTaskResource("disk", task.resources?.disk)} limit={EMPTY} /></Grid>
                <Grid item xs={6} md={3}><ResourceTile label="GPUs" allocated={formatTaskResource("gpus", task.resources?.gpus)} limit={EMPTY} /></Grid>
                <Grid item xs={12}><DetailField label="Ports" mono>{formatTaskResource("ports", task.resources?.ports)}</DetailField></Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Status history</Typography>
              {statuses.length ? (
                <Paper variant="outlined" sx={{ overflowX: "auto" }}>
                  <Table size="small" aria-label="Task status history">
                    <TableHead><TableRow><TableCell>Time</TableCell><TableCell>State</TableCell><TableCell>Health</TableCell><TableCell>Message</TableCell></TableRow></TableHead>
                    <TableBody>
                      {statuses.map((status, index) => (
                        <TableRow key={`${status.timestamp || "unknown"}-${index}`}>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>{formatTaskTimestamp(status.timestamp)}</TableCell>
                          <TableCell>{status.state?.replace("TASK_", "") || EMPTY}</TableCell>
                          <TableCell>{status.healthy === true ? "Healthy" : status.healthy === false ? "Unhealthy" : EMPTY}</TableCell>
                          <TableCell sx={{ minWidth: 180 }}>{status.message || EMPTY}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              ) : <Typography color="text.secondary">No status history available.</Typography>}
            </Box>

            <Box component="details" className="advanced-details">
              <Box component="summary">Advanced container data</Box>
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
      kind="task"
      title={`${task?.name || task?.id || "Task"} logs`}
      agent={task?._agent}
      task={task}
    />
    <TaskShellDialog open={shellOpen} task={task} onClose={() => setShellOpen(false)} />
    </>
  );
}
