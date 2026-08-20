import { StrictMode, Suspense, lazy, useEffect } from "react";
import type { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./home";
import { sandboxes } from "./sandbox-registry";
import type { SandboxMeta } from "./sandbox-registry";

// One lazy component per sandbox path, memoized module-level so a re-render never recreates
// the lazy component (which would remount and re-fetch).
const cache = new Map<string, ComponentType>();
function Sandbox({ meta }: { meta: SandboxMeta }) {
    useEffect(() => {
        document.title = `${meta.title} · React Sandbox`;
    }, [meta.title]);

    let Component = cache.get(meta.path);
    if (!Component) {
        Component = lazy(meta.component);
        cache.set(meta.path, Component);
    }
    return <Component />;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Suspense fallback={<div className="p-8 text-gray-500">Chargement…</div>}>
                <Routes>
                    <Route index element={<Home />} path="*" />
                    {sandboxes.map((sandbox) => (
                        <Route key={sandbox.path} path={sandbox.path} element={<Sandbox meta={sandbox} />} />
                    ))}
                </Routes>
            </Suspense>
        </BrowserRouter>
    </StrictMode>,
);
