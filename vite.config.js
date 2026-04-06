import { defineConfig } from "vite";

/** Dev-only proxy: staging bucket has no CORS for localhost; same-origin fetch via Vite. */
export default defineConfig({
  server: {
    proxy: {
      "/__s3-staging": {
        target: "https://spaceport-ml-processing-staging.s3.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__s3-staging/, ""),
      },
    },
  },
});
