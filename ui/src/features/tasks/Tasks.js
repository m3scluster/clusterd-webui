import { Box } from "@mui/material";
import { useAuth } from "../../Home";
import TasksTable from "./TasksTable";
import { FormatTimeDifference } from "../../libs/functions";
import { QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";

const queryClient = new QueryClient();

const useMesosTasks = (authHeader?: string) => {
  return useQuery({
    queryKey: ["mesosTasks", authHeader],
    enabled: !!authHeader,
    queryFn: async () => {
      const resp = await fetch(
        "https://172.30.96.0:5050/frameworks?order=dsc&limit=-1",
        {
          headers: { Authorization: authHeader },
        }
      );

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      return resp.json();
    },
    refetchInterval: 5000,
    staleTime: 4000,
    keepPreviousData: true,
  });
};

function DataInner() {
  const { authHeader } = useAuth();
  const { data, isLoading, isFetching, error } = useMesosTasks(authHeader);

  const frameworks = data?.frameworks ?? [];
  const tasks = frameworks.flatMap((f: any) => f.tasks ?? []);
  const unreachable = frameworks.flatMap((f: any) => f.unreachable_tasks ?? []);
  const completed = frameworks.flatMap((f: any) => f.completed_tasks ?? []);

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

