import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/ternary/ternaryOrAnd",
    title: "Ternary vs Logical Operators",
    description: "Comparing ternary, AND, and OR operators for conditional logic",
    category: "Syntax",
    icon: "🔀",
    component: () => import("./TestTernaryOrAndOperator"),
};
