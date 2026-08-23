import React, { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Chip,
  IconButton,
  LinearProgress,
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
import { AGENT_RESOURCE_TYPES, agentResourceStats } from "../../dialogs/agentDetails";
import { sortByTimestamp } from "../../libs/sortingHelpers";
import { resourceIdFromHash } from "../../app/hashNavigation";

function StatusChip({ agent }) {
  if (agent.active) return <Chip label="Active" color="success" size="small" />;
  if (agent.deactivated) return <Chip label="Deactivated" color="warning" size="small" />;
  return <Chip label="Inactive" size="small" />;
}

function ResourceUtilizationCell({ agent }) {
  return (
    <Box
      sx={{
        minWidth: 380,
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        columnGap: 2,
        rowGap: 0.75,
      }}
    >
      {AGENT_RESOURCE_TYPES.map(({ name, shortLabel }) => {
        const utilization = agentResourceStats(agent, name).utilization;
        return (
          <Box key={name} sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="caption" sx={{ minWidth: 30, textAlign: "left" }}>{shortLabel}</Typography>
            <LinearProgress
              aria-label={`${shortLabel} utilization`}
              variant="determinate"
              value={utilization}
              sx={{ flex: 1, height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" sx={{ minWidth: 34, textAlign: "right" }}>
              {utilization.toFixed(0)}%
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default function AgentsTable({ agents = [] }) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const sortedAgents = sortByTimestamp(agents, "registered_time");

  React.useEffect(() => {
    const selectFromHash = () => {
      const id = resourceIdFromHash(window.location.hash, "agents");
      if (id) setSelectedAgent(agents.find((agent) => String(agent.id) === id) || null);
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, [agents]);

  return (
    <>
      <Paper className="table-card" elevation={0}>
        <Typography className="table-title" variant="h6">Agents</Typography>
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 980 }} size="small" aria-label="Agents">
            <TableHead>
              <TableRow>
                <TableCell width={52} aria-label="Actions" />
                <TableCell>Agent ID</TableCell>
                <TableCell>Hostname</TableCell>
                <TableCell sx={{ width: 110, whiteSpace: "nowrap" }}>Mesos version</TableCell>
                <TableCell sx={{ width: 110, whiteSpace: "nowrap" }}>Status</TableCell>
                <TableCell sx={{ width: 400, whiteSpace: "nowrap" }}>Resources & utilization</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>No agents.</TableCell></TableRow>
              )}
              {sortedAgents.map((agent) => (
                <TableRow
                  hover
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  sx={{ cursor: "pointer" }}
                >
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
                  <TableCell><StatusChip agent={agent} /></TableCell>
                  <TableCell><ResourceUtilizationCell agent={agent} /></TableCell>
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