import { Box } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import TasksTable from "./TasksTable";
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
  const { request, isAuthenticated } = useAuth();
  const { data, isLoading, error } = useMesosTasks(request, isAuthenticated);

  const frameworks = data?.frameworks ?? [];
  const agentsById = new Map((data?.agents ?? []).map((agent) => [agent.id, agent]));
  const attachAgent = (tasks) => tasks.map((task) => ({ ...task, _agent: agentsById.get(task.slave_id) || null }));
  const tasks = attachAgent(frameworks.flatMap((framework) => framework.tasks ?? []));
  const unreachable = attachAgent(frameworks.flatMap((framework) => framework.unreachable_tasks ?? []));
  const completed = attachAgent(frameworks.flatMap((framework) => framework.completed_tasks ?? []));

  return (
    <Box sx={{ p: 2 }}>
      {isLoading && <Box>…Loading…</Box>}

      {error && (
        <Box sx={{ color: "red" }}>
          Error: {error}
        </Box>
      )}

      <p></p>
      <TasksTable tasks={tasks} title="Active Tasks"/>
      <p></p>
      <TasksTable tasks={unreachable} title="Unreachable Tasks"/>
      <p></p>
      <TasksTable tasks={completed} title="Completed Tasks"/>

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

