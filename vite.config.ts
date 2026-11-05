import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Domínio próprio (mespin.com.br): o site é servido na raiz, então base = "/".
export default defineConfig({
  base: "/",
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"]
  }
});
