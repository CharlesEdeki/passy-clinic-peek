import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

/**
 * This project builds to static HTML (see docs/architecture.md) --
 * `tanstackStart({ prerender: ... })` renders every route at build time and
 * there is no server runtime in production, so there is no Nitro plugin
 * here and no server entry to redirect.
 */
export default defineConfig({
  plugins: [
    tailwindcss(),
    // Resolves the "@/*" -> "./src/*" alias from tsconfig.json's `paths`,
    // so no separate resolve.alias entry is needed for it.
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: true,
        crawlLinks: true,
      },
    }),
    viteReact(),
  ],

  resolve: {
    // Multiple copies of these across the dependency tree cause subtle bugs
    // (two React instances, broken Context, TanStack Query cache misses) --
    // force everything to resolve to one.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },

  server: {
    port: 8080,
    // Vite rejects requests whose Host header it doesn't recognise, which
    // breaks VS Code port forwarding and devtunnel-style tunnels.
    allowedHosts: [".devtunnels.ms", ".ngrok-free.app", ".trycloudflare.com"],
  },
});