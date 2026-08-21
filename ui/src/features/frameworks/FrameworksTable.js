import React, { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Chip,
  IconButton,
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
import FrameworkDetailsDialog from "../../dialogs/FrameworkDetailsDialog";
import {
  formatFrameworkResource,
  formatFrameworkTimestamp,
  frameworkStatus,
  frameworkTaskCounts,
  normalizeFrameworkRoles,
} from "../../dialogs/frameworkDetails";

export default function FrameworksTable({ frameworks = [], title }) {
  const [selectedFramework, setSelectedFramework] = useState(null);

  return (
    <>
      <Paper className="table-card" elevation={0}>
        <Typography className="table-title" variant="h6">{title}</Typography>
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 1050 }} size="small" aria-label={title}>
            <TableHead>
              <TableRow>
                <TableCell width={52} aria-label="Actions" />
                <TableCell>Name</TableCell>
                <TableCell>Framework ID</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell align="right">Active tasks</TableCell>
                <TableCell align="right">CPU</TableCell>
                <TableCell align="right">Memory</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {frameworks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4, color: "text.secondary" }}>No frameworks.</TableCell>
                </TableRow>
              )}
              {frameworks.map((framework) => {
                const status = frameworkStatus(framework);
                const counts = frameworkTaskCounts(framework);
                return (
                  <TableRow hover key={framework.id}>
                    <TableCell>
                      <Tooltip title="View framework details">
                        <IconButton
                          aria-label={`View details for ${framework.name || framework.id}`}
                          size="small"
                          onClick={() => setSelectedFramework(framework)}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{framework.name || "—"}</TableCell>
                    <TableCell className="id-cell" title={framework.id}>{framework.id || "—"}</TableCell>
                    <TableCell>{framework.hostname || "—"}</TableCell>
                    <TableCell>{normalizeFrameworkRoles(framework)}</TableCell>
                    <TableCell align="right">{counts.active}</TableCell>
                    <TableCell align="right">{formatFrameworkResource("cpus", framework.resources?.cpus)}</TableCell>
                    <TableCell align="right">{formatFrameworkResource("mem", framework.resources?.mem)}</TableCell>
                    <TableCell><Chip label={status.label} color={status.color} size="small" /></TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{formatFrameworkTimestamp(framework.registered_time)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <FrameworkDetailsDialog
        open={Boolean(selectedFramework)}
        framework={selectedFramework}
        onClose={() => setSelectedFramework(null)}
      />
    </>
  );
}
