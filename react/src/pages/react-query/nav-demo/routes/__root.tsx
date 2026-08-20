import { createRootRouteWithContext, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { NAV_DEMO_QUERY_KEY } from "../queryOptions";

type NavDemoContext = {
    queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<NavDemoContext>()({
    component: RootLayout,
});

function RootLayout() {
    // status passe à "pending" pendant qu'un loader est en vol — c'est cet
    // indicateur qui rend visible la navigation "qui attend" de fetchQuery,
    // par opposition à la navigation instantanée d'ensureQueryData.
    const isPending = useRouterState({ select: (s) => s.status === "pending" });
    const queryClient = useQueryClient();

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <nav className="flex gap-2">
                    <Link
                        to="/"
                        activeProps={{ className: "bg-indigo-600 text-white" }}
                        activeOptions={{ exact: true }}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/ensure"
                        activeProps={{ className: "bg-indigo-600 text-white" }}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                        /ensure
                    </Link>
                    <Link
                        to="/fetch"
                        activeProps={{ className: "bg-indigo-600 text-white" }}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                        /fetch
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    {isPending && (
                        <span className="text-xs font-mono font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full animate-pulse">
                            Navigation en cours…
                        </span>
                    )}
                    <button
                        onClick={() =>
                            queryClient.invalidateQueries({ queryKey: NAV_DEMO_QUERY_KEY, refetchType: "none" })
                        }
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
                    >
                        Forcer périmé
                    </button>
                </div>
            </div>

            <Outlet />
        </div>
    );
}
