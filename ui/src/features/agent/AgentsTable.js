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
import AgentDetailsDialog from "../../dialogs/AgentDetailsDialog";

function StatusChip({ agent }) {
  if (agent.active) return <Chip label="Active" color="success" size="small" />;
  if (agent.deactivated) return <Chip label="Deactivated" color="warning" size="small" />;
  return <Chip label="Inactive" size="small" />;
}

export default function AgentsTable({ agents = [] }) {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <>
      <Paper className="table-card" elevation={0}>
        <Typography className="table-title" variant="h6">Agents</Typography>
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 760 }} size="small" aria-label="Agents">
            <TableHead>
              <TableRow>
                <TableCell width={52} aria-label="Actions" />
                <TableCell>Agent ID</TableCell>
                <TableCell>Hostname</TableCell>
                <TableCell>Mesos version</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>No agents.</TableCell></TableRow>
              )}
              {agents.map((agent) => (
                <TableRow hover key={agent.id}>
                  <TableCell>
                    <Tooltip title="View agent details">
                      <IconButton
                        aria-label={`View details for ${agent.hostname || agent.id}`}
                        size="small"
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="id-cell" title={agent.id}>{agent.id || "—"}</TableCell>
                  <TableCell>{agent.hostname || "—"}</TableCell>
                  <TableCell>{agent.version || "—"}</TableCell>
                  <TableCell align="right"><StatusChip agent={agent} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <AgentDetailsDialog
        open={Boolean(selectedAgent)}
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </>
  );
}