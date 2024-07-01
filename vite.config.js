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
      entry: {
        index: resolve(__dirname, "lib/index.js"),
        openai: resolve(__dirname, "lib/openai.js"),
        chrome: resolve(__dirname, "lib/chrome.js"),
        gemini: resolve(__dirname, "lib/gemini.js"),
      },
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["@preact/signals-core", "@google/generative-ai", "openai"],
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
