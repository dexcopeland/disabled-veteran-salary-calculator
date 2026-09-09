/// <reference types="vitest/config" />
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages is served from /disabled-veteran-salary-calculator/.
  // Cloudflare Workers Builds injects WORKERS_CI=1 and serves from the root.
  base:
    process.env.WORKERS_CI === "1"
      ? "/"
      : "/disabled-veteran-salary-calculator/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
