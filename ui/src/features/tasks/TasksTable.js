import React, { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import TaskDetailsDialog from "../../dialogs/TaskDetailsDialog";
import { taskSandboxHref } from "../../dialogs/taskDetails";
import { FormatTimeDifference, HealthBadge, StateBadge } from "../../libs/functions";
import "../../app/App.css";

function latestStatus(task) {
  return task.statuses?.at(-1);
}

function taskHealth(task) {
  const status = latestStatus(task);
  if (status?.healthy === true) return "Healthy";
  if (status?.healthy === false) return "Unhealthy";
  return null;
}

function taskStarted(task) {
  const timestamp = latestStatus(task)?.timestamp;
  return timestamp ? `${FormatTimeDifference(timestamp)} ago` : "—";
}

export default function TasksTable({ tasks = [], title }) {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <>
      <Paper className="table-card" elevation={0}>
        <Typography className="table-title" variant="h6">{title}</Typography>
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 1050 }} size="small" aria-label={title}>
            <TableHead>
              <TableRow>
                <TableCell width={52} aria-label="Actions" />
                <TableCell>Framework ID</TableCell>
                <TableCell>Task ID</TableCell>
                <TableCell>Task name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Health</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Sandbox</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length === 0 && (
                <TableRow><TableCell colSpan={10} align="center" sx={{ py: 4, color: "text.secondary" }}>No tasks.</TableCell></TableRow>
              )}
              {tasks.map((task) => {
                const sandboxHref = taskSandboxHref(task);
                return (
                  <TableRow hover key={task.id}>
                    <TableCell>
                      <Tooltip title="View task details">
                        <IconButton aria-label={`View details for ${task.name || task.id}`} size="small" onClick={() => setSelectedTask(task)}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="id-cell" title={task.framework_id}>{task.framework_id || "—"}</TableCell>
                    <TableCell className="id-cell" title={task.id}>{task.id || "—"}</TableCell>
                    <TableCell>{task.name || "—"}</TableCell>
                    <TableCell>{Array.isArray(task.role) ? task.role.join(", ") : task.role || "—"}</TableCell>
                    <TableCell><StateBadge state={task.state} /></TableCell>
                    <TableCell><HealthBadge health={taskHealth(task)} /></TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{taskStarted(task)}</TableCell>
                    <TableCell>{task.hostname || "—"}</TableCell>
                    <TableCell>
                      {sandboxHref ? <Link href={sandboxHref}>Sandbox</Link> : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TaskDetailsDialog open={Boolean(selectedTask)} task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  );
}