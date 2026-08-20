import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        // Must precede react() — scoped to the nav-demo sub-feature only,
        // the rest of the app still routes via react-router.
        tanstackRouter({
            target: "react",
            routesDirectory: "./src/pages/react-query/nav-demo/routes",
            generatedRouteTree: "./src/pages/react-query/nav-demo/routeTree.gen.ts",
            autoCodeSplitting: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        // 0.0.0.0 — required when Vite runs in the `front` compose profile; harmless on the host.
        host: true,
        port: 5173,
        strictPort: true,
        // Vite's DNS-rebinding guard rejects any Host header it doesn't recognize —
        // localhost/127.0.0.1 pass by default, custom /etc/hosts aliases don't.
        allowedHosts: ["sandbox.local"],
        proxy: {
            // No `rewrite`: /api is forwarded verbatim, which is exactly the prefix
            // config/routes/api_platform.yaml declares.
            "/api": {
                target: process.env.API_PROXY_TARGET ?? "http://localhost:8000",
                changeOrigin: true,
            },
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: "./src/test-setup.ts",
        globals: true,
    },
});
