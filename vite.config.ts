import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/calendar-system-design",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "src/utils/setupTests.tsx",
    coverage: {
      provider: "istanbul", // or 'v8'
    },
  },
});
