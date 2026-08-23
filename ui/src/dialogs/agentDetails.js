const EMPTY = "—";

export const AGENT_RESOURCE_TYPES = [
  { name: "cpus", label: "CPU", shortLabel: "CPU" },
  { name: "mem", label: "Memory", shortLabel: "MEM" },
  { name: "disk", label: "Disk", shortLabel: "DISK" },
  { name: "gpus", label: "GPUs", shortLabel: "GPU" },
];

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function formatAgentTimestamp(timestamp) {
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds) || seconds <= 0) return EMPTY;
  return new Date(seconds * 1000).toLocaleString();
}

export function formatAgentResource(name, value) {
  if (value === null || value === undefined || value === "") return EMPTY;
  if (name === "mem" || name === "disk") return `${finiteNumber(value).toLocaleString()} MiB`;
  return String(value);
}

export function agentResourceStats(agent, name) {
  const total = finiteNumber(agent?.resources?.[name]);
  const used = finiteNumber(agent?.used_resources?.[name]);
  const offered = finiteNumber(agent?.offered_resources?.[name]);
  return {
    total,
    used,
    offered,
    available: Math.max(total - used - offered, 0),
    utilization: total > 0 ? Math.min(Math.max((used / total) * 100, 0), 100) : 0,
  };
}

export function attachTasksToAgents(agents, frameworks) {
  const tasksByAgent = new Map();
  (Array.isArray(frameworks) ? frameworks : []).forEach((framework) => {
    (Array.isArray(framework?.tasks) ? framework.tasks : []).forEach((task) => {
      if (!task?.slave_id) return;
      const tasks = tasksByAgent.get(task.slave_id) || [];
      tasks.push(task);
      tasksByAgent.set(task.slave_id, tasks);
    });
  });

  return (Array.isArray(agents) ? agents : []).map((agent) => {
    const taskAgent = { ...agent };
    const tasks = (tasksByAgent.get(agent?.id) || []).map((task) => ({
      ...task,
      _agent: taskAgent,
    }));
    return { ...taskAgent, _tasks: tasks };
  });
}

export function visibleAgentTasks(tasks) {
  const activeStates = new Set(["TASK_RUNNING", "TASK_STARTING", "TASK_STAGING"]);
  return (Array.isArray(tasks) ? tasks : []).filter((task) => activeStates.has(task?.state));
}

export function agentAdvancedDetails(agent) {
  const value = agent || {};
  return {
    offered_resources_full: value.offered_resources_full || [],
    reserved_resources: value.reserved_resources || {},
    reserved_resources_full: value.reserved_resources_full || {},
    unreserved_resources: value.unreserved_resources || {},
    unreserved_resources_full: value.unreserved_resources_full || [],
    used_resources_full: value.used_resources_full || [],
  };
}
