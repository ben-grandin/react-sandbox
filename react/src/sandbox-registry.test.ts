import { describe, expect, it } from "vitest";
import { sandboxes } from "./sandbox-registry";

describe("sandbox-registry", () => {
    it("expose des chemins uniques", () => {
        const paths = sandboxes.map((sandbox) => sandbox.path);
        expect(new Set(paths).size).toBe(paths.length);
    });

    it("expose un titre non vide et un chemin absolu pour chaque sandbox", () => {
        for (const sandbox of sandboxes) {
            expect(sandbox.title.length).toBeGreaterThan(0);
            expect(sandbox.path.startsWith("/")).toBe(true);
        }
    });
});
