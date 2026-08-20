import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/api-pagination",
    title: "Pagination Hydra",
    description: "Collection paginée API Platform — totalItems, member, view.next",
    category: "Data Fetching",
    icon: "📄",
    apiDomain: "Pagination",
    component: () => import("./ApiPaginationPage").then((m) => ({ default: m.ApiPaginationPage })),
};
