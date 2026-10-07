import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Dev-only. Customer CSVs live in .private and are never copied into dist. */
function privateWhoopDev(): Plugin {
  const root = path.resolve(process.cwd(), ".private/whoop");
  return {
    name: "private-whoop-dev",
    configureServer(server) {
      server.middlewares.use("/whoop", (req, res, next) => {
        const name = path.basename((req.url ?? "/").split("?")[0]);
        if (!name.endsWith(".csv")) {
          next();
          return;
        }
        const file = path.resolve(root, name);
        if (!file.startsWith(root) || !fs.existsSync(file)) {
          res.statusCode = 404;
          res.end();
          return;
        }
        res.setHeader("content-type", "text/csv; charset=utf-8");
        res.setHeader("cache-control", "no-store");
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), privateWhoopDev()],
  server: {
    host: true,
    port: 5173,
  },
});
