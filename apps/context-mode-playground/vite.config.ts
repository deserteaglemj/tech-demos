import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { contextModeApiPlugin } from "./server/vite-plugin-api.ts";

export default defineConfig({
  plugins: [react(), contextModeApiPlugin()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
