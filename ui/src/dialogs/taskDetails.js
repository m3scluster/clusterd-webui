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
