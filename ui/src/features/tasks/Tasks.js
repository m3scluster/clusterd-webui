import { Box } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import TasksTable from "./TasksTable";
import { QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";

const queryClient = new QueryClient();

const useMesosTasks = (request, authenticated) => {
  return useQuery({
    queryKey: ["mesosTasks", authenticated],
    enabled: authenticated,
    queryFn: () => request("/frameworks?order=dsc&limit=-1"),
    refetchInterval: 5000,
    staleTime: 4000,
    keepPreviousData: true,
  });
};

function DataInner() {
  const { request, isAuthenticated } = useAuth();
  const { data, isLoading, error } = useMesosTasks(request, isAuthenticated);

  const frameworks = data?.frameworks ?? [];
  const tasks = frameworks.flatMap((framework) => framework.tasks ?? []);
  const unreachable = frameworks.flatMap((framework) => framework.unreachable_tasks ?? []);
  const completed = frameworks.flatMap((framework) => framework.completed_tasks ?? []);

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

