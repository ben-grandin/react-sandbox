import { createRouter } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

export function createNavDemoRouter(queryClient: QueryClient) {
    return createRouter({
        routeTree,
        basepath: "/react-query/nav-demo",
        context: { queryClient },
        // Désactivé : on veut que le loader se déclenche réellement au clic,
        // pas en avance au survol — sinon fetchQuery "attendrait" invisiblement.
        defaultPreload: false,
    });
}

export type NavDemoRouter = ReturnType<typeof createNavDemoRouter>;

declare module "@tanstack/react-router" {
    interface Register {
        router: NavDemoRouter;
    }
}
