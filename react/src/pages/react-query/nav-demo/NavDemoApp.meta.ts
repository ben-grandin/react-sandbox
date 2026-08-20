import type { SandboxMeta } from "../../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/react-query/nav-demo/*",
    title: "Navigation avec loader",
    description: "ensureQueryData vs fetchQuery dans un loader TanStack Router",
    category: "Data Fetching",
    icon: "🧭",
    component: () => import("./NavDemoApp").then((m) => ({ default: m.NavDemoApp })),
};
