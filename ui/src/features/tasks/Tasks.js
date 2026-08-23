import React from "react";
import { Box, TextField } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import TasksTable from "./TasksTable";
import { attachAgentsToTasks } from "../../dialogs/taskDetails";
import { filterFrameworkTasks } from "../../dialogs/frameworkDetails";
import { QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";

const queryClient = new QueryClient();

const useMesosTasks = (request, authenticated) => {
  return useQuery({
    queryKey: ["mesosTasks", authenticated],
    enabled: authenticated,
    queryFn: async () => {
      const [frameworkData, agentData] = await Promise.all([
        request("/frameworks?order=dsc&limit=-1"),
        request("/slaves"),
      ]);
      return { frameworks: frameworkData.frameworks ?? [], agents: agentData.slaves ?? [] };
    },
    refetchInterval: 5000,
    staleTime: 4000,
    keepPreviousData: true,
  });
};

function DataInner() {
  const [search, setSearch] = React.useState("");
  const { request, isAuthenticated } = useAuth();
  const { data, isLoading, error } = useMesosTasks(request, isAuthenticated);

  const frameworks = data?.frameworks ?? [];
  const agents = data?.agents ?? [];
  const tasks = attachAgentsToTasks(frameworks.flatMap((framework) => framework.tasks ?? []), agents);
  const unreachable = attachAgentsToTasks(frameworks.flatMap((framework) => framework.unreachable_tasks ?? []), agents);
  const completed = attachAgentsToTasks(frameworks.flatMap((framework) => framework.completed_tasks ?? []), agents);
  const visibleTasks = filterFrameworkTasks(tasks, search);
  const visibleUnreachable = filterFrameworkTasks(unreachable, search);
  const visibleCompleted = filterFrameworkTasks(completed, search);

  return (
    <Box sx={{ p: 2 }}>
      {isLoading && <Box>…Loading…</Box>}

      {error && (
        <Box sx={{ color: "red" }}>
          Error: {error}
        </Box>
      )}

      <TextField
        fullWidth
        size="small"
        label="Search tasks by name or ID"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        inputProps={{ "aria-label": "Search tasks by name or ID" }}
        sx={{ mb: 2 }}
      />
      <TasksTable tasks={visibleTasks} title="Active Tasks"/>
      <p></p>
      <TasksTable tasks={visibleUnreachable} title="Unreachable Tasks"/>
      <p></p>
      <TasksTable tasks={visibleCompleted} title="Completed Tasks"/>

    </Box>
  );
}

export default function Data() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataInner />
    </QueryClientProvider>
  );
}

