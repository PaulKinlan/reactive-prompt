import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  server: {
    host: "0.0.0.0",
    hmr: true, // Change this line to false disable auto-refreshing.
  },
  resolve: {
    alias: {
      "@paulkinlan/reactive-prompt": resolve(__dirname, "lib"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.js"),
      name: "ReactivePrompt",
      fileName: "index",
    },
  },
});
