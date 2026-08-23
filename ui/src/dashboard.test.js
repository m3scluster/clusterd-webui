import { deriveDashboard, formatDashboardResource } from "./dashboard";

test("formats GPU capacity as a count instead of memory", () => {
  expect(formatDashboardResource(2, "GPUs")).toBe("2");
  expect(formatDashboardResource(1.5, "CPU")).toBe("1.5");
  expect(formatDashboardResource(2048, "Memory")).toBe("2 GiB");
});

test("derives cluster health, workload and resource monitoring from Mesos data", () => {
  const result = deriveDashboard(
    { cluster: "devtest", hostname: "master-1", frameworks: [{ active: true }], slaves: [{ active: true }] },
    { version: "1.11.0", leader: "master@master-1:5050" },
    {
      "master/elected": 1,
      "master/uptime_secs": 3661,
      "master/slaves_active": 3,
      "master/frameworks_active": 2,
      "master/tasks_running": 7,
      "master/tasks_staging": 1,
      "master/cpus_total": 16,
      "master/cpus_used": 6,
      "master/mem_total": 32000,
      "master/mem_used": 8000,
      "master/disk_total": 100000,
      "master/disk_used": 25000,
      "master/gpus_total": 8,
      "master/gpus_used": 2,
      "master/event_queue_messages": 4,
      "master/outstanding_offers": 2,
      "allocator/mesos/allocation_run_ms/p95": 12.5,
      "system/load_1min": 0.75,
    },
  );

  expect(result.cluster.name).toBe("devtest");
  expect(result.cluster.healthy).toBe(true);
  expect(result.cluster.uptime).toBe("1h 1m");
  expect(result.counts).toMatchObject({ agents: 3, frameworks: 2, runningTasks: 7, pendingTasks: 1 });
  expect(result.resources.cpu).toMatchObject({ total: 16, used: 6, percent: 37.5 });
  expect(result.resources.memory.percent).toBe(25);
  expect(result.resources.gpu).toMatchObject({ total: 8, used: 2, percent: 25 });
  expect(result.monitoring).toMatchObject({ queuedMessages: 4, outstandingOffers: 2, allocatorP95: 12.5, load1m: 0.75 });
});

test("uses state-summary collections and safe zeroes when optional metrics are absent", () => {
  const result = deriveDashboard(
    { cluster: "small", frameworks: [{ active: true }, { active: false }], slaves: [{ active: true }, { active: false }] },
    {},
    {},
  );

  expect(result.counts.agents).toBe(1);
  expect(result.counts.frameworks).toBe(1);
  expect(result.resources.cpu).toMatchObject({ total: 0, used: 0, percent: 0 });
  expect(result.monitoring.droppedMessages).toBe(0);
});
