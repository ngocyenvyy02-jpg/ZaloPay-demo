import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  // svgr must run here (not just in packages/design-system) — the DS ships
  // source, and Vite applies plugins based on the CONSUMING app's config.
  plugins: [react(), svgr()],
});
