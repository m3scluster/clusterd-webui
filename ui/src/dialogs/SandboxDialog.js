import React from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { agentHttpEndpoint } from "../logs/logApi";
import { useAuth } from "../auth/AuthContext";

export function findTaskDirectory(state, task) {
  if (task?.directory) return task.directory;
  const frameworks = [
    ...(state?.frameworks || []),
    ...(state?.completed_frameworks || []),
  ];
  const framework = frameworks.find((item) => String(item.id) === String(task?.framework_id));
  const executors = [
    ...(framework?.executors || []),
    ...(framework?.completed_executors || []),
  ];
  const executor = executors.find((item) => String(item.id) === String(task?.executor_id));
  const tasks = [
    ...(executor?.tasks || []),
    ...(executor?.queued_tasks || []),
    ...(executor?.completed_tasks || []),
  ];
  return tasks.find((item) => String(item.id) === String(task?.id))?.directory || executor?.directory || null;
}

function isDirectory(file) {
  return file?.type === "DIRECTORY" || file?.kind === "directory" || String(file?.mode || "").startsWith("d") || String(file?.path || "").endsWith("/");
}

function normalizeListing(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.files)) return response.files;
  if (Array.isArray(response?.listing)) return response.listing;
  if (Array.isArray(response?.file_infos)) return response.file_infos;
  return [];
}

function joinPath(parent, child) {
  if (String(child).startsWith("/")) return child;
  return `${String(parent).replace(/\/$/, "")}/${child}`;
}

export default function SandboxDialog({ open, task, agent, onClose }) {
  const { request } = useAuth();
  const [path, setPath] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open || !task || !agent) return undefined;
    let active = true;
    setLoading(true);
    setError("");
    const endpoint = agentHttpEndpoint(agent, "/state");
    if (!endpoint) {
      setError("The agent API endpoint is unavailable.");
      setLoading(false);
      return undefined;
    }
    request(endpoint)
      .then((state) => {
        if (!active) return;
        const directory = findTaskDirectory(state, task);
        if (!directory) throw new Error("The task sandbox directory could not be found.");
        setPath(directory);
      })
      .catch((reason) => {
        if (active) {
          setError(reason.message || "The task sandbox could not be opened.");
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [agent, open, request, task]);

  React.useEffect(() => {
    if (!open || !path || !agent) return undefined;
    let active = true;
    setLoading(true);
    setError("");
    const endpoint = agentHttpEndpoint(agent, "/files/browse");
    request(`${endpoint}?path=${encodeURIComponent(path)}`)
      .then((response) => {
        if (active) setFiles(normalizeListing(response));
      })
      .catch((reason) => {
        if (active) setError(reason.message || "The sandbox files could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [agent, open, path, request]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Task sandbox</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {path && <Typography color="text.secondary" variant="body2" sx={{ wordBreak: "break-all" }}>{path}</Typography>}
          {error && <Alert severity="error">{error}</Alert>}
          {loading ? <CircularProgress size={24} /> : (
            <List dense>
              {path && path !== "/" && <ListItem disablePadding><ListItemButton onClick={() => setPath(path.replace(/\/[^/]+\/?$/, "") || "/")}><ListItemText primary=".." /></ListItemButton></ListItem>}
              {files.map((file) => {
                const filePath = file.path || file.name || "";
                const directory = isDirectory(file);
                return <ListItem key={filePath} disablePadding>
                  {directory ? <ListItemButton onClick={() => setPath(joinPath(path, filePath))}>
                    <FolderIcon sx={{ mr: 1 }} fontSize="small" /><ListItemText primary={filePath} />
                  </ListItemButton> : <ListItemText sx={{ px: 2, py: 1 }} primary={<><InsertDriveFileIcon sx={{ mr: 1, verticalAlign: "middle" }} fontSize="small" />{filePath}</>} secondary={file.size == null ? null : `${file.size} bytes`} />}
                </ListItem>;
              })}
              {!files.length && <ListItem><ListItemText primary="The sandbox directory is empty." /></ListItem>}
            </List>
          )}
        </Stack>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}
