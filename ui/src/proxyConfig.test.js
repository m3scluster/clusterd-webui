const { getAgentProxyRoute, getProxyConfig } = require("./proxyConfig");

test("defaults the development proxy to devtest with self-signed TLS support", () => {
  expect(getProxyConfig({})).toMatchObject({
    target: "https://devtest.lab.internal:5050",
    changeOrigin: true,
    secure: false,
  });
});

test("allows overriding the ClusterD target", () => {
  expect(getProxyConfig({ CLUSTERD_PROXY_TARGET: "https://master.example:5050/" }).target).toBe(
    "https://master.example:5050",
  );
});

test("validates and rewrites a development agent API route", () => {
  expect(getAgentProxyRoute("/agent-api/agent-1.example/5051/api/v1")).toEqual({
    target: "https://agent-1.example:5051",
    path: "/api/v1",
  });
  expect(getAgentProxyRoute("/agent-2/5052/api/v1")).toEqual({
    target: "https://agent-2:5052",
    path: "/api/v1",
  });
  expect(getAgentProxyRoute("/agent-api/agent-1.example/5051/state")).toEqual({
    target: "https://agent-1.example:5051",
    path: "/state",
  });
  expect(getAgentProxyRoute("/agent-api/agent-1.example/5051/files/browse")).toEqual({
    target: "https://agent-1.example:5051",
    path: "/files/browse",
  });
});

test("rejects unsafe or malformed agent proxy targets", () => {
  expect(getAgentProxyRoute("/agent-api/bad%2Fhost/5051/api/v1")).toBeNull();
  expect(getAgentProxyRoute("/agent-api/agent/99999/api/v1")).toBeNull();
  expect(getAgentProxyRoute("/agent-api/agent/5051/not-allowed")).toBeNull();
});
