import React, { act } from "react";
import { createRoot } from "react-dom/client";
import TaskShellDialog from "./TaskShellDialog";
import { launchTaskShell, readProcessIOStream } from "./taskExecApi";

jest.mock("../auth/AuthContext", () => ({
  useAuth: () => ({ authHeader: "Basic synthetic" }),
}));

jest.mock("./taskExecApi", () => {
  const actual = jest.requireActual("./taskExecApi");
  return {
    ...actual,
    launchTaskShell: jest.fn().mockResolvedValue({ body: {} }),
    readProcessIOStream: jest.fn().mockImplementation(async (_body, onOutput) => {
      onOutput({ stream: "stdout", data: "synthetic-shell-output" });
    }),
    sendTaskShellInput: jest.fn().mockResolvedValue({ ok: true }),
  };
});

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  const react = jest.requireActual("react");
  return {
    ...actual,
    Dialog: ({ open, children }) => open ? react.createElement("div", null, children) : null,
    DialogTitle: ({ children }) => react.createElement("div", null, children),
  };
});

let container;
let root;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  global.fetch = jest.fn();
  Object.defineProperty(global, "crypto", {
    configurable: true,
    value: { randomUUID: jest.fn(() => "synthetic-uuid") },
  });
  launchTaskShell.mockResolvedValue({ body: {} });
  readProcessIOStream.mockImplementation(async (_body, onOutput) => {
    onOutput({ stream: "stdout", data: "synthetic-shell-output" });
  });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  jest.clearAllMocks();
});

test("opens an authenticated shell session and renders streamed output", async () => {
  const task = {
    id: "task-1",
    name: "Synthetic task",
    state: "TASK_RUNNING",
    _agent: { hostname: "agent-1.example", port: 5051 },
    statuses: [{ container_status: { container_id: { value: "task-container" } } }],
  };

  await act(async () => {
    root.render(<TaskShellDialog open task={task} onClose={() => {}} />);
  });

  expect(launchTaskShell).toHaveBeenCalledWith(
    global.fetch,
    "//agent-1.example:5051/api/v1",
    "Basic synthetic",
    { value: "webui-shell-synthetic-uuid", parent: { value: "task-container" } },
    expect.anything(),
  );
  expect(readProcessIOStream).toHaveBeenCalled();
  expect(container.textContent).toContain("Task shell");
  expect(container.textContent).toContain("synthetic-shell-output");
});
