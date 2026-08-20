import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/ternary/SimpleTernary",
    title: "Simple Ternary Examples",
    description: "Demonstrating basic conditional rendering with ternary operators",
    category: "Syntax",
    icon: "⁉️",
    component: () => import("./SimpleTernary").then((m) => ({ default: m.SimpleTernary })),
};
