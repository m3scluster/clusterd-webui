export const TAB_ROUTES = [
  { value: 0, hash: "#/" },
  { value: 1, hash: "#/tasks" },
  { value: 2, hash: "#/frameworks" },
  { value: 3, hash: "#/agents" },
  { value: 4, hash: "#/master" },
];

function firstRouteSegment(hash) {
  return String(hash || "")
    .trim()
    .replace(/^#/, "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")[0]
    .toLowerCase();
}

export function tabValueFromHash(hash) {
  switch (firstRouteSegment(hash)) {
    case "tasks":
      return 1;
    case "frameworks":
      return 2;
    case "agents":
      return 3;
    case "master":
      return 4;
    case "":
    case "index.html":
    default:
      return 0;
  }
}

export function hashFromTabValue(value) {
  return TAB_ROUTES.find((route) => route.value === value)?.hash || TAB_ROUTES[0].hash;
}
