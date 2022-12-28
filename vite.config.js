import { resolve } from "path"
import { defineConfig } from "vite"
import { chromeExtension } from "rollup-plugin-chrome-extension"

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
        rollupOptions: {
            input: "src/manifest.json",
            plugins: [chromeExtension({ wrapContentScripts: false })],
            output: {
                dir: "./dist",
                entryFileNames: "[name].js",
                sourcemap: "hidden",
            },
        },
    },
})
