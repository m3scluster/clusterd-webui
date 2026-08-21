import { useCallback, useEffect, useState } from "react";
import TerminalIcon from "@mui/icons-material/Terminal";
import { Alert, Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "./auth/AuthContext";
import LogViewerDialog from "./logs/LogViewerDialog";
import { formatClusterInfo } from "./masterUtils";

export default function ClusterInfo() {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [error, setError] = useState("");
  const [logsOpen, setLogsOpen] = useState(false);
  const [clusterInfo, setClusterInfo] = useState(null);
  const { request } = useAuth();

  const getMesosState = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request("/state");
      setStateData(data);
      setError("");

      // Format the cluster information for better display
      const formattedInfo = formatClusterInfo(data);
      setClusterInfo(formattedInfo);
    } catch (stateError) {
      setError(stateError.message || "Master details could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    getMesosState();
  }, [getMesosState]);

  return (
    <>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2}>
          <Box>
            <Typography variant="h5" fontWeight={700}>Master details</Typography>
            <Typography color="text.secondary">ClusterD control-plane information and logs</Typography>
          </Box>
          <Button startIcon={<TerminalIcon />} variant="contained" onClick={() => setLogsOpen(true)}>View master log</Button>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        {loading && !stateData ? (
          <Box className="centered"><CircularProgress /></Box>
        ) : stateData && clusterInfo && (
          <Paper className="table-card" elevation={0} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography color="text.secondary" variant="caption">Server</Typography>
                <Typography fontWeight={600}>{stateData.hostname || "—"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography color="text.secondary" variant="caption">Status</Typography>
                <Typography fontWeight={600}>
                  {clusterInfo.isLeader ? (
                    <span style={{ color: '#4caf50' }}>Leader</span>
                  ) : (
                    <span style={{ color: '#ff9800' }}>Follower</span>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography color="text.secondary" variant="caption">Version</Typography>
                <Typography fontWeight={600}>Apache Mesos {stateData.version || "—"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography color="text.secondary" variant="caption">Cluster</Typography>
                <Typography fontWeight={600}>{clusterInfo.cluster || "—"}</Typography>
              </Grid>
              {clusterInfo.masterCount > 0 && (
                <Grid item xs={12}>
                  <Typography color="text.secondary" variant="caption">Master Servers ({clusterInfo.masterCount})</Typography>
                  <Box sx={{ mt: 1 }}>
                    {clusterInfo.masters.map((master, index) => (
                      <Paper key={index} elevation={0} sx={{ p: 2, mb: 1, backgroundColor: 'background.default' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary" variant="caption">ID</Typography>
                            <Typography fontWeight={600} fontSize="small">
                              {master.id || "—" }
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary" variant="caption">Hostname</Typography>
                            <Typography fontWeight={600} fontSize="small">
                              {master.hostname || "—" }
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary" variant="caption">Status</Typography>
                            <Typography fontWeight={600} fontSize="small">
                              {clusterInfo.currentLeaderId === master.id ? (
                                <span style={{ color: '#4caf50' }}>Leader</span>
                              ) : (
                                <span style={{ color: '#ff9800' }}>Follower</span>
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography color="text.secondary" variant="caption">PID/StartTime</Typography>
                            <Typography fontWeight={600} fontSize="small">
                              {master.pid || "—"} / {master.start_time ? new Date(master.start_time * 1000).toLocaleString() : "—"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}
      </Stack>
      <LogViewerDialog open={logsOpen} onClose={() => setLogsOpen(false)} kind="master" title="ClusterD master log" />
    </>
  );
}