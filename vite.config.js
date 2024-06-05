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
      formats: ["es"],
      entry: resolve(__dirname, "lib/index.js"),
      fileName: "index",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["@preact/signals-core"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          signalsCore: "@preact/signals-core",
        },
      },
    },
    soucemap: true,
  },
});
