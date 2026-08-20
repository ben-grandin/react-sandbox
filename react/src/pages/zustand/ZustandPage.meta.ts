import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/zustand",
    title: "Zustand",
    description: "State management with Zustand — store, selectors, re-renders",
    category: "State",
    icon: "🐻",
    component: () => import("./ZustandPage").then((m) => ({ default: m.ZustandPage })),
};
