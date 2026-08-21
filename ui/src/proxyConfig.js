const DEFAULT_TARGET = "https://devtest.lab.internal:5050";

function getProxyConfig(env = process.env) {
  const target = (env.CLUSTERD_PROXY_TARGET || DEFAULT_TARGET).replace(/\/$/, "");
  return {
    target,
    changeOrigin: true,
    secure: false,
    logLevel: env.CLUSTERD_PROXY_LOG_LEVEL || "warn",
  };
}

module.exports = { DEFAULT_TARGET, getProxyConfig };
