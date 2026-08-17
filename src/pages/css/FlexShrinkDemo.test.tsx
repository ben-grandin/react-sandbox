import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FlexShrinkDemo } from "./FlexShrinkDemo";

// jsdom ne calcule pas les layouts → getBoundingClientRect retourne la width
// déclarée dans style, ou 0 par défaut.
function mockBoundingRect() {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
        function (this: HTMLElement) {
            const w = this.style?.width ? parseFloat(this.style.width) : 0;
            return { width: w, height: 0, top: 0, left: 0, right: w, bottom: 0, x: 0, y: 0, toJSON: () => {} } as DOMRect;
        }
    );
}

// ResizeObserver n'existe pas en jsdom. Ce stub :
// - déclenche le callback immédiatement à l'observe() initial
// - expose une liste pour permettre de re-déclencher manuellement après un changement de style
const activeObservers: Array<{ elements: Element[]; cb: ResizeObserverCallback }> = [];

function mockResizeObserver() {
    activeObservers.length = 0;

    global.ResizeObserver = class {
        private entry: { elements: Element[]; cb: ResizeObserverCallback };

        constructor(cb: ResizeObserverCallback) {
            this.entry = { elements: [], cb };
            activeObservers.push(this.entry);
        }

        observe(el: Element) {
            this.entry.elements.push(el);
            this.fire(el);
        }

        fire(el: Element) {
            this.entry.cb(
                [{ target: el, contentRect: el.getBoundingClientRect() } as ResizeObserverEntry],
                this as unknown as ResizeObserver
            );
        }

        unobserve() {}
        disconnect() {}
    };
}

// Re-déclenche tous les observers (simule une notification du browser après un changement de style)
function triggerAllResizeObservers() {
    act(() => {
        for (const { elements, cb } of activeObservers) {
            for (const el of elements) {
                cb(
                    [{ target: el, contentRect: el.getBoundingClientRect() } as ResizeObserverEntry],
                    {} as ResizeObserver
                );
            }
        }
    });
}

describe("FlexShrinkDemo", () => {
    beforeEach(() => {
        mockBoundingRect();
        mockResizeObserver();
    });

    it("affiche 160px sur le right child quand width est settée à 160px", async () => {
        render(<FlexShrinkDemo />);

        await userEvent.click(screen.getByRole("button"));
        // Simule la notification du browser après le changement de style
        triggerAllResizeObservers();

        // Le right child affiche sa clientWidth dans le div orange
        const measurement = document.querySelector(".text-orange-600.tabular-nums");
        expect(measurement).toHaveTextContent("160px");
    });
});
