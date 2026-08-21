import {
  formatFrameworkResource,
  formatFrameworkTimestamp,
  frameworkAdvancedDetails,
  frameworkRoles,
  frameworkStatus,
  frameworkTaskCounts,
  frameworkWebUiUrl,
  normalizeFrameworkRoles,
} from "./frameworkDetails";

test("normalizes plural and singular framework roles", () => {
  expect(frameworkRoles({ roles: ["analytics", "analytics", "batch"] })).toEqual(["analytics", "batch"]);
  expect(frameworkRoles({ role: "legacy" })).toEqual(["legacy"]);
  expect(normalizeFrameworkRoles({ role: "legacy" })).toBe("legacy");
  expect(normalizeFrameworkRoles({})).toBe("—");
  expect(normalizeFrameworkRoles(null)).toBe("—");
});

test("formats timestamps and resources without leaking invalid numbers", () => {
  expect(formatFrameworkTimestamp(undefined)).toBe("—");
  expect(formatFrameworkTimestamp(0)).toBe("—");
  expect(formatFrameworkTimestamp(1704067200)).toContain("2024");
  expect(formatFrameworkResource("cpus", 1.25)).toBe("1.25");
  expect(formatFrameworkResource("mem", 1024)).toContain("MiB");
  expect(formatFrameworkResource("ports", "[31000-32000]")).toBe("[31000-32000]");
  expect(formatFrameworkResource("disk", "invalid")).toBe("—");
});

test("derives meaningful framework connection states", () => {
  expect(frameworkStatus({ active: true, connected: true })).toEqual({ label: "Active", color: "success" });
  expect(frameworkStatus({ active: true, connected: false }).label).toBe("Active · disconnected");
  expect(frameworkStatus({ recovered: true }).label).toBe("Recovered");
  expect(frameworkStatus({ unregistered_time: 10 }).label).toBe("Unregistered");
  expect(frameworkStatus({ connected: true }).label).toBe("Connected · inactive");
  expect(frameworkStatus({}).label).toBe("Inactive");
  expect(frameworkStatus(null).label).toBe("Inactive");
});

test("counts task collections safely", () => {
  expect(frameworkTaskCounts({
    tasks: [{ id: "running" }],
    completed_tasks: [{ id: "done-1" }, { id: "done-2" }],
    unreachable_tasks: null,
    executors: [{}],
  })).toEqual({ active: 1, completed: 2, unreachable: 0, executors: 1 });
  expect(frameworkTaskCounts()).toEqual({ active: 0, completed: 0, unreachable: 0, executors: 0 });
  expect(frameworkTaskCounts(null)).toEqual({ active: 0, completed: 0, unreachable: 0, executors: 0 });
});

test("only accepts HTTP framework Web UI links", () => {
  expect(frameworkWebUiUrl("https://framework.example:10000")).toBe("https://framework.example:10000/");
  expect(frameworkWebUiUrl("javascript:alert(1)")).toBeNull();
  expect(frameworkWebUiUrl("not a URL")).toBeNull();
});

test("keeps verbose framework collections in advanced details", () => {
  const tasks = [{ id: "task-1" }];
  expect(frameworkAdvancedDetails({ tasks, offer_constraints: { role: "batch" } })).toMatchObject({
    tasks,
    completed_tasks: [],
    offer_constraints: { role: "batch" },
  });
});
