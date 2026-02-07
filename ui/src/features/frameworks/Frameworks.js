import { Box } from "@mui/material";
import { useAuth } from "../../Home";
import FrameworksTable from './FrameworksTable.js';
import { FormatTimeDifference } from "../../libs/functions";
import { QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";

const queryClient = new QueryClient();

const useMesosFrameworks = (authHeader?: string) => {
  return useQuery({
    queryKey: ["mesosFrameworks", authHeader],
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
  const { data, isLoading, isFetching, error } = useMesosFrameworks(authHeader);

  const frameworks = data?.frameworks ?? [];
  const active = frameworks.filter(f => f.active === true);
  const inactive = frameworks.filter(f => f.active === false);
  const completed = data?.completed_frameworks ?? [];

  return (
    <Box sx={{ p: 2 }}>
      {isLoading && <Box>…Loading…</Box>}

      {error && (
        <Box sx={{ color: "red" }}>
          Error: {error}
        </Box>
      )}

      <p></p>
      <FrameworksTable frameworks={active} title="Active Frameworks" />
      <p></p>
      <FrameworksTable frameworks={inactive} title="Inactive Frameworks" />
      <p></p>
      <FrameworksTable frameworks={completed} title="Completed Frameworks" />

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

