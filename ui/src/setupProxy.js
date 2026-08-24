const { createProxyMiddleware } = require("http-proxy-middleware");
const { getAgentProxyRoute, getMasterProxyRoute, getProxyConfig } = require("./proxyConfig");

module.exports = function setupProxy(app) {
  const proxy = createProxyMiddleware(getProxyConfig());
  app.use(["/api", "/master", "/metrics", "/frameworks", "/slaves", "/state"], proxy);

  const agentProxy = createProxyMiddleware({
    target: "https://127.0.0.1:5051",
    changeOrigin: true,
    secure: false,
    logLevel: process.env.CLUSTERD_PROXY_LOG_LEVEL || "warn",
    router: (request) => getAgentProxyRoute(request.originalUrl)?.target,
    pathRewrite: (path) => getAgentProxyRoute(path)?.path || path,
  });
  app.use("/agent-api", (request, response, next) => {
    if (!getAgentProxyRoute(request.originalUrl)) {
      response.status(400).send("Invalid agent API target");
      return;
    }
    agentProxy(request, response, next);
  });

  const masterProxy = createProxyMiddleware({
    target: "https://127.0.0.1:5050",
    changeOrigin: true,
    secure: false,
    logLevel: process.env.CLUSTERD_PROXY_LOG_LEVEL || "warn",
    router: (request) => getMasterProxyRoute(request.originalUrl)?.target,
    pathRewrite: (path) => getMasterProxyRoute(path)?.path || path,
  });
  app.use("/master-api", (request, response, next) => {
    if (!getMasterProxyRoute(request.originalUrl)) {
      response.status(400).send("Invalid master API target");
      return;
    }
    masterProxy(request, response, next);
  });
};
