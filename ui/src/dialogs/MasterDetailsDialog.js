import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { masterHttpEndpoint } from "../masterUtils";
import { normalizeMetricsResponse } from "../utilization";
import { UTILIZATION_TYPES, utilizationColor } from "../utilization";

export default function MasterDetailsDialog({ open, master, onClose }) {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [error, setError] = useState("");
  const { request } = useAuth();


  // Get metrics for a specific master server
  const fetchMasterMetrics = useCallback(async () => {
    setLoading(true); 
    setError("");
    
    try {
      const endpoint = masterHttpEndpoint(master);
      if (!endpoint) throw new Error("Master metrics endpoint is unavailable");
      const metricData = await request(endpoint);
      setMetrics(normalizeMetricsResponse(metricData));
    } catch (err) {
      setError(err.message || `Failed to fetch metrics for master ${master.id}`);
      console.error("Master metrics error:", err);
    } finally {
      setLoading(false);
    }
  }, [master, request]);

  useEffect(() => {
    if (open && master) {
      fetchMasterMetrics();
    }
  }, [open, master, fetchMasterMetrics]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Master Details</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error">{error}</Alert>}
        
        {master ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Master Identity</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography color="text.secondary">ID</Typography>
                    <Typography fontWeight={600}>{master.id || "—"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography color="text.secondary">Hostname</Typography>
                    <Typography fontWeight={600}>{master.hostname || "—"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography color="text.secondary">Status</Typography>
                    <Typography fontWeight={600}>
                      {master.isLeader ? (
                        <span style={{ color: '#4caf50' }}>Leader</span>
                      ) : (
                        <span style={{ color: '#ff9800' }}>Follower</span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography color="text.secondary">PID</Typography>
                    <Typography fontWeight={600}>{master.pid || "—"}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Utilization Metrics</Typography>
              <Paper elevation={0} sx={{ p: 2 }}>
                {loading ? (
                  <Box className="centered"><CircularProgress /></Box>
                ) : (
                  <Grid container spacing={1.5}>
                    {UTILIZATION_TYPES.map(({ name, label }) => {
                      const value = Number(metrics[`master/${name}_utilization`]);
                      const valid = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : null;
                      return (
                        <Grid item xs={6} sm={4} md={2.4} key={name}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              textAlign: "center",
                              borderTop: 5,
                              borderColor: utilizationColor(valid),
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">{label}</Typography>
                            <Typography variant="h6" fontWeight={700}>
                              {valid === null ? "—" : `${valid.toFixed(1)}%`}
                            </Typography>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box className="centered">
            <Typography>No master details available</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}