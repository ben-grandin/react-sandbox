import type { ComponentType } from "react";

export type SandboxMeta = {
    /** react-router path, used verbatim. Add a trailing "/*" when the sandbox owns a nested router. */
    path: string;
    title: string;
    description: string;
    /** Free-form; the home page derives its filter chips from the values actually present. */
    category: string;
    icon: string;
    /** Set only for sandboxes backed by the API: the api-platform/src/Domain folder name. */
    apiDomain?: string;
    /** React.lazy-compatible loader. Named export → () => import("./X").then((m) => ({ default: m.X })) */
    component: () => Promise<{ default: ComponentType }>;
};

const modules = import.meta.glob<{ meta: SandboxMeta }>("./pages/**/*.meta.ts", { eager: true });

export const sandboxes: SandboxMeta[] = Object.entries(modules)
    .map(([file, module]) => {
        if (!module.meta?.path) throw new Error(`${file} must export a "meta" with a "path"`);
        return module.meta;
    })
    .sort((a, b) => a.title.localeCompare(b.title, "fr"));
