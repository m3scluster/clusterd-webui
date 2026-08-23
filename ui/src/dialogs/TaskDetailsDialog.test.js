import React, { act } from "react";
import { createRoot } from "react-dom/client";
import TaskDetailsDialog from "./TaskDetailsDialog";

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
jest.mock("../shell/TaskShellDialog", () => ({ open }) => open ? <div data-testid="task-shell" /> : null);

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

test("shows the agent hostname in task details", () => {
  act(() => {
    root.render(
      <TaskDetailsDialog
        open
        onClose={() => {}}
        task={{
          id: "task-1",
          name: "Synthetic task",
          slave_id: "agent-1",
          _agent: { id: "agent-1", hostname: "agent-1.example" },
        }}
      />
    );
  });

  expect(container.textContent).toContain("Host");
  expect(container.textContent).toContain("agent-1.example");
});

test("offers a task shell when an agent and nested container are available", () => {
  act(() => {
    root.render(
      <TaskDetailsDialog
        open
        onClose={() => {}}
        task={{
          id: "task-1",
          name: "Synthetic task",
          _agent: { hostname: "agent-1.example", port: 5051 },
          statuses: [{ container_status: { container_id: { value: "task-container" } } }],
        }}
      />
    );
  });

  const shellButton = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Open task shell");
  expect(shellButton).not.toBeNull();
  expect(shellButton.disabled).toBe(false);
  act(() => shellButton.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  expect(container.querySelector('[data-testid="task-shell"]')).not.toBeNull();
});
