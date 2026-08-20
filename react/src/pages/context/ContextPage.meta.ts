import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/context",
    title: "createContext",
    description: "useContext avec et sans Provider — valeur par défaut vs valeur injectée",
    category: "State",
    icon: "🧩",
    component: () => import("./ContextPage").then((m) => ({ default: m.ContextPage })),
};
