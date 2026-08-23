export function formatTaskTimestamp(timestamp) {
  const value = Number(timestamp);
  if (!Number.isFinite(value) || value <= 0) return "—";
  return new Date(value * 1000).toLocaleString();
}

export function normalizeTaskRoles(role) {
  if (Array.isArray(role)) return role.length ? role.join(", ") : "—";
  return role || "—";
}

export function formatTaskResource(name, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (name === "mem" || name === "disk") return `${Number(value).toLocaleString()} MiB`;
  return String(value);
}

export function sortTaskStatuses(statuses = []) {
  return [...statuses].sort((left, right) => (Number(left.timestamp) || 0) - (Number(right.timestamp) || 0));
}

export function taskHealth(task) {
  const latest = task?.statuses?.at(-1);
  if (latest?.healthy === true) return "Healthy";
  if (latest?.healthy === false) return "Unhealthy";
  return "—";
}

export function taskHost(task) {
  return task?._agent?.hostname || task?.hostname || "—";
}

function indexAgents(agents) {
  return new Map(
    (Array.isArray(agents) ? agents : []).map((agent) => [agent.id, agent]),
  );
}

function attachIndexedAgents(tasks, agentsById) {
  return (Array.isArray(tasks) ? tasks : []).map((task) => ({
    ...task,
    _agent: agentsById.get(task?.slave_id) || null,
  }));
}

export function attachAgentsToTasks(tasks, agents) {
  return attachIndexedAgents(tasks, indexAgents(agents));
}

export function attachAgentsToFramework(framework, agents) {
  const value = framework || {};
  const agentsById = indexAgents(agents);
  return {
    ...value,
    tasks: attachIndexedAgents(value.tasks, agentsById),
    unreachable_tasks: attachIndexedAgents(value.unreachable_tasks, agentsById),
    completed_tasks: attachIndexedAgents(value.completed_tasks, agentsById),
  };
}

export function taskSandboxHref(task) {
  const agentId = task?.slave_id;
  const frameworkId = task?.framework_id;
  const taskId = task?.id;
  if (!agentId || !frameworkId || !taskId) return null;

  const executorId = task.executor_id || taskId;
  const encode = (value) => encodeURIComponent(String(value));
  return `#/agents/${encode(agentId)}/frameworks/${encode(frameworkId)}/executors/${encode(executorId)}/tasks/${encode(taskId)}/browse`;
}

export function taskAdvancedDetails(task) {
  const value = task || {};
  const statusContainers = (value.statuses || [])
    .filter((status) => status.container_status)
    .map((status) => ({ timestamp: status.timestamp, state: status.state, container_status: status.container_status }));

  return {
    container: value.container || null,
    discovery: value.discovery || null,
    status_containers: statusContainers,
  };
}
