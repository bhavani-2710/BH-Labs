import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["@wasmer/sdk"],
  },
  server: {
    headers: {
      // Required for @wasmer/sdk — SharedArrayBuffer is only available in
      // cross-origin isolated contexts.
      // IMPORTANT: use "credentialless" (not "require-corp") so cross-origin
      // CDN fetches (e.g. Wasmer registry, Pyodide) are not blocked.
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
    },
  },
});