import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/css/flex-shrink",
    title: "flex-shrink + min-width:auto",
    description: "Pourquoi setter une width peut paradoxalement réduire la taille d'un flex item",
    category: "CSS",
    icon: "📐",
    component: () => import("./FlexShrinkDemo").then((m) => ({ default: m.FlexShrinkDemo })),
};
