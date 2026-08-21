const { getProxyConfig } = require("./proxyConfig");

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
