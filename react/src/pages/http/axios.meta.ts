import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/http/axios",
    title: "HTTP Status Explorer",
    description: "Interactive visualization of HTTP status codes and responses",
    category: "HTTP",
    icon: "🌐",
    component: () => import("./axios"),
};
