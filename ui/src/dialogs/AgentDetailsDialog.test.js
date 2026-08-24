import React, { act } from "react";
import { createRoot } from "react-dom/client";
import AgentDetailsDialog from "./AgentDetailsDialog";

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  const react = jest.requireActual("react");
  return {
    ...actual,
    Dialog: ({ open, children }) => open ? react.createElement("div", null, children) : null,
    DialogTitle: ({ children }) => react.createElement("div", null, children),
  };
});

jest.mock("../logs/LogViewerDialog", () => () => null);
jest.mock("../features/tasks/TasksTable", () => ({ tasks, title, showFrameworkId }) => (
  <div data-testid="agent-tasks" data-framework-id={String(showFrameworkId)}>
    {title}: {tasks.map((task) => task.id).join(", ")}
  </div>
));

let container;
let root;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

test("shows the tasks currently running on the agent", () => {
  act(() => {
    root.render(
      <AgentDetailsDialog
        open
        onClose={() => {}}
        agent={{
          id: "agent-1",
          hostname: "agent-1.example",
          _tasks: [
            { id: "active-task-1", state: "TASK_RUNNING" },
            { id: "failed-task", state: "TASK_FAILED" },
            { id: "active-task-2", state: "TASK_STARTING" },
            { id: "finished-task", state: "TASK_FINISHED" },
          ],
        }}
      />
    );
  });

  const tasks = container.querySelector('[data-testid="agent-tasks"]');
  expect(tasks?.textContent).toContain("Tasks on this agent (2)");
  expect(tasks?.textContent).toContain("active-task-1");
  expect(tasks?.textContent).toContain("active-task-2");
  expect(tasks?.textContent).not.toContain("failed-task");
  expect(tasks?.textContent).not.toContain("finished-task");
  expect(tasks?.dataset.frameworkId).toBe("false");
  expect(container.textContent.indexOf("Resources & allocation")).toBeLessThan(container.textContent.indexOf("Tasks on this agent"));
});
