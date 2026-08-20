import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FetchQueryPanel } from "./FetchQueryPanel";
import { EnsureQueryDataPanel } from "./EnsureQueryDataPanel";

// staleTime: 0 -> la donnée est périmée dès sa réception. delayMs court
// pour que le test reste rapide.
function renderPanels(staleTime = 0) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
        <QueryClientProvider client={queryClient}>
            <FetchQueryPanel staleTime={staleTime} delayMs={5} />
            <EnsureQueryDataPanel staleTime={staleTime} delayMs={5} />
        </QueryClientProvider>,
    );
}

describe("fetchQuery vs ensureQueryData", () => {
    it("fetchQuery refetch quand la donnée est périmée, ensureQueryData ne refetch pas", async () => {
        const user = userEvent.setup();
        renderPanels(0);

        const fetchPanel = screen.getByTestId("fetch-query-panel");
        const ensurePanel = screen.getByTestId("ensure-query-data-panel");

        const fetchButton = within(fetchPanel).getByRole("button", { name: /Call fetchQuery/ });
        const ensureButton = within(ensurePanel).getByRole("button", { name: /Call ensureQueryData/ });

        const fetchCallCount = () => within(fetchPanel).getByTestId("call-count").textContent;
        const ensureCallCount = () => within(ensurePanel).getByTestId("call-count").textContent;

        // Premier appel : rien en cache -> même comportement pour les deux.
        await user.click(fetchButton);
        await waitFor(() => expect(fetchCallCount()).toBe("1"));

        await user.click(ensureButton);
        await waitFor(() => expect(ensureCallCount()).toBe("1"));

        // staleTime: 0 -> la donnée est immédiatement périmée. Second appel :
        // fetchQuery refetch (compteur -> 2), ensureQueryData retourne le
        // cache périmé sans refetch (compteur reste à 1).
        await user.click(fetchButton);
        await waitFor(() => expect(fetchCallCount()).toBe("2"));

        await user.click(ensureButton);
        // Laisse le temps à un éventuel (mauvais) refetch de se produire.
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(ensureCallCount()).toBe("1");
    });
});
