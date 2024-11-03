/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import csp from "vite-plugin-csp-guard";

export default defineConfig({
  plugins: [
    crx({ manifest }),
    csp({
      algorithm: "sha256", // The algorithm to use for hashing
      dev: {
        run: true, // If you want to run the plugin in `vite dev` mode
      },
      policy: {
        // Specify the policy here.
        "script-src": ["'self'", "https://academico.ifms.edu.br"], // Example: Allow Google Analytics
        "style-src": ["'self'", "https://fonts.googleapis.com"], // Example: Allow Google Fonts
      },
    }),
  ],
});
