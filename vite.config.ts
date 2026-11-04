import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// "base" deve ser o nome do repositório no GitHub Pages.
export default defineConfig({
  base: "/LojaMespin2.0/",
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"]
  }
});
