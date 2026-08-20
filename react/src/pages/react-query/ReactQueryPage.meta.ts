import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/react-query",
    title: "fetchQuery vs ensureQueryData",
    description: "Comparaison par clic et par navigation (loader) des deux méthodes de TanStack Query",
    category: "Data Fetching",
    icon: "🗃️",
    component: () => import("./ReactQueryPage").then((m) => ({ default: m.ReactQueryPage })),
};
