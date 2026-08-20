import type { SandboxMeta } from "../../sandbox-registry";

export const meta: SandboxMeta = {
    path: "/serialization-demo",
    title: "Sérialisation : maison vs Symfony vs API Platform",
    description: "4 façons de renvoyer une collection depuis un State Provider — dont le piège skolem-IRI (PIC-5442)",
    category: "Data Fetching",
    icon: "🧩",
    apiDomain: "SerializationDemo",
    component: () => import("./SerializationDemoPage").then((m) => ({ default: m.SerializationDemoPage })),
};
