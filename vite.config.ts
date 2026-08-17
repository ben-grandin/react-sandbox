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
    test: {
        environment: "jsdom",
        setupFiles: "./src/test-setup.ts",
        globals: true,
    },
});
