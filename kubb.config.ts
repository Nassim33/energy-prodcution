import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";
import { pluginClient } from "@kubb/plugin-client";
import { pluginReactQuery } from "@kubb/plugin-react-query";

// `pnpm generate` reads openapi.yaml and writes fully-typed, zod-validated
// fetch + TanStack Query hooks into src/api/gen — nothing in that folder
// should be hand-edited, it is regenerated whenever the spec changes.
export default defineConfig({
  root: ".",
  input: {
    path: "./openapi.yaml",
  },
  output: {
    path: "./src/api/gen",
    clean: true,
  },
  plugins: [
    pluginOas({}),
    pluginTs({
      output: { path: "types" },
    }),
    pluginZod({
      output: { path: "zod" },
    }),
    pluginClient({
      output: { path: "clients/fetch" },
      // points generated calls at our hand-written fetch client
      // (src/lib/api-client.ts), which exports the `client`/`Client`
      // contract Kubb expects — retries, timeouts, CSRF header, abort
      // handling all happen there, once, instead of per-endpoint.
      importPath: "@/lib/api-client",
    }),
    pluginReactQuery({
      output: { path: "hooks" },
      query: { methods: ["get"] },
      mutation: { methods: ["post", "put", "patch", "delete"] },
    }),
  ],
});
