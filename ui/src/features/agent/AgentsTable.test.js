import React, { act } from "react";
import { createRoot } from "react-dom/client";
import AgentsTable from "./AgentsTable";

jest.mock("../../dialogs/AgentDetailsDialog", () => ({ open, agent }) => (
  open ? <div data-testid="selected-agent">{agent.id}</div> : null
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

test("opens agent details when its table row is clicked", () => {
  act(() => {
    root.render(
      <AgentsTable agents={[{
        id: "agent-1",
        hostname: "agent-1.example",
        active: true,
        resources: { cpus: 4, mem: 8192, disk: 10000, gpus: 0 },
      }]} />
    );
  });

  const agentRow = container.querySelector("tbody tr");
  act(() => {
    agentRow.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(container.querySelector('[data-testid="selected-agent"]')?.textContent).toBe("agent-1");
});
