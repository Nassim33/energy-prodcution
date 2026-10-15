import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import svgr from "vite-plugin-svgr";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // generates src/routeTree.gen.ts from file-based routes in src/routes
    TanStackRouterVite({ routesDirectory: "./src/routes" }),
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      // RTE open data: same-origin /rte/* in the browser is forwarded to the RTE
      // host. RTE's gateway rejects browser requests carrying an `Origin` header
      // (403), so we strip it — the request then looks server-to-server.
      "/rte": {
        target: "https://digital.iservices.rte-france.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rte/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("origin");
            proxyReq.removeHeader("referer");
          });
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: ["src/api/gen/**", "src/routeTree.gen.ts"],
    },
  },
});
