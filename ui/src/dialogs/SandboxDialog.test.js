import { findTaskDirectory } from "./SandboxDialog";

test("uses the task sandbox directory from the agent state", () => {
  const task = { framework_id: "framework", executor_id: "executor", id: "task" };
  const state = {
    frameworks: [{
      id: "framework",
      executors: [{
        id: "executor",
        directory: "/executor",
        tasks: [{ id: "task", directory: "/executor/task" }],
      }],
    }],
  };
  expect(findTaskDirectory(state, task)).toBe("/executor/task");
});

test("falls back to the executor sandbox when the agent omits task directory", () => {
  const task = { framework_id: "framework", executor_id: "executor", id: "task" };
  const state = {
    frameworks: [{
      id: "framework",
      executors: [{ id: "executor", directory: "/executor", tasks: [{ id: "task" }] }],
    }],
  };
  expect(findTaskDirectory(state, task)).toBe("/executor");
});
