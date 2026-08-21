const { createProxyMiddleware } = require("http-proxy-middleware");
const { getProxyConfig } = require("./proxyConfig");

module.exports = function setupProxy(app) {
  const proxy = createProxyMiddleware(getProxyConfig());
  app.use(["/master", "/metrics", "/frameworks", "/slaves", "/state"], proxy);
};
