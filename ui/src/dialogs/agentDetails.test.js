import {
  AGENT_RESOURCE_TYPES,
  agentAdvancedDetails,
  agentResourceStats,
  formatAgentResource,
  formatAgentTimestamp,
} from "./agentDetails";

test("keeps Mesos memory and disk values in MiB", () => {
  expect(formatAgentResource("mem", 14849)).toBe("14,849 MiB");
  expect(formatAgentResource("disk", 232652)).toBe("232,652 MiB");
  expect(formatAgentResource("ports", "[31000-32000]")).toBe("[31000-32000]");
  expect(formatAgentResource("cpus", null)).toBe("—");
});

test("calculates available resources and utilization", () => {
  const agent = {
    resources: { cpus: 4 },
    used_resources: { cpus: 1 },
    offered_resources: { cpus: 0.5 },
  };
  expect(agentResourceStats(agent, "cpus")).toEqual({
    total: 4,
    used: 1,
    offered: 0.5,
    available: 2.5,
    utilization: 25,
  });
});

test("resource calculations are safe for zero, missing and overcommitted values", () => {
  expect(agentResourceStats(null, "mem")).toEqual({ total: 0, used: 0, offered: 0, available: 0, utilization: 0 });
  expect(agentResourceStats({ resources: { mem: 10 }, used_resources: { mem: 8 }, offered_resources: { mem: 5 } }, "mem").available).toBe(0);
});

test("interprets Mesos timestamps as seconds", () => {
  const formatted = formatAgentTimestamp(1704067200);
  expect(formatted).not.toBe("—");
  expect(formatted).not.toContain("1970");
  expect(formatAgentTimestamp(null)).toBe("—");
});

test("advanced details are null-safe", () => {
  expect(agentAdvancedDetails(null)).toMatchObject({
    offered_resources_full: [],
    reserved_resources: {},
    used_resources_full: [],
  });
});

test("defines CPU, memory, disk and GPU for agent resource views", () => {
  expect(AGENT_RESOURCE_TYPES.map(({ name }) => name)).toEqual(["cpus", "mem", "disk", "gpus"]);
});

test("handles GPU resources properly in agentResourceStats", () => {
  const agent = {
    resources: { gpus: 2 },
    used_resources: { gpus: 1 },
    offered_resources: { gpus: 0.5 },
  };

  expect(agentResourceStats(agent, "gpus")).toEqual({
    total: 2,
    used: 1,
    offered: 0.5,
    available: 0.5,
    utilization: 50,
  });
});

test("handles agent with no GPU resources", () => {
  const agent = {
    resources: { cpus: 4, mem: 8192 },
    used_resources: { cpus: 2, mem: 4096 },
    offered_resources: { cpus: 0.5, mem: 1024 },
  };

  expect(agentResourceStats(agent, "gpus")).toEqual({
    total: 0,
    used: 0,
    offered: 0,
    available: 0,
    utilization: 0,
  });
});
