import {
  formatTaskResource,
  formatTaskTimestamp,
  normalizeTaskRoles,
  sortTaskStatuses,
  taskAdvancedDetails,
  taskHealth,
  taskSandboxHref,
} from "./taskDetails";

test("formats Mesos resources without treating MiB values as bytes", () => {
  expect(formatTaskResource("mem", 2000)).toBe("2,000 MiB");
  expect(formatTaskResource("disk", 1000)).toBe("1,000 MiB");
  expect(formatTaskResource("ports", "[31002-31003]")).toBe("[31002-31003]");
});

test("normalizes missing fields and task roles", () => {
  expect(formatTaskTimestamp(undefined)).toBe("—");
  expect(normalizeTaskRoles(["m3s", "production"])).toBe("m3s, production");
  expect(normalizeTaskRoles("m3s")).toBe("m3s");
  expect(taskHealth({ statuses: [{ healthy: false }] })).toBe("Unhealthy");
});

test("sorts status history chronologically without mutating the source", () => {
  const statuses = [{ state: "TASK_RUNNING", timestamp: 20 }, { state: "TASK_STAGING", timestamp: 10 }];
  expect(sortTaskStatuses(statuses).map((status) => status.state)).toEqual(["TASK_STAGING", "TASK_RUNNING"]);
  expect(statuses[0].state).toBe("TASK_RUNNING");
});

test("collects nested container status for the advanced section", () => {
  expect(taskAdvancedDetails({ statuses: [{ state: "TASK_RUNNING", timestamp: 20, container_status: { network_infos: [] } }] }))
    .toMatchObject({ status_containers: [{ state: "TASK_RUNNING", container_status: { network_infos: [] } }] });
  expect(taskAdvancedDetails(null)).toEqual({ container: null, discovery: null, status_containers: [] });
});

test("builds the sandbox link with an explicit executor id", () => {
  expect(taskSandboxHref({
    slave_id: "agent-1",
    framework_id: "framework-1",
    executor_id: "executor-1",
    id: "task-1",
  })).toBe("#/agents/agent-1/frameworks/framework-1/executors/executor-1/tasks/task-1/browse");
});

test("uses the task id for a default executor when executor_id is empty", () => {
  expect(taskSandboxHref({
    slave_id: "agent/1",
    framework_id: "framework 1",
    executor_id: "",
    id: "task#1",
  })).toBe("#/agents/agent%2F1/frameworks/framework%201/executors/task%231/tasks/task%231/browse");
});

test("does not build a sandbox link without all required identifiers", () => {
  expect(taskSandboxHref(null)).toBeNull();
  expect(taskSandboxHref({ slave_id: "agent", framework_id: "framework", id: "" })).toBeNull();
});
