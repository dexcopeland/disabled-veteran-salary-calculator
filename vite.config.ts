import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  base: "/disabled-veteran-salary-calculator/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})