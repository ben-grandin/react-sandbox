import { useState } from "react";
import { Link } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StaleTimeControl } from "./StaleTimeControl";
import { FetchQueryPanel } from "./FetchQueryPanel";
import { EnsureQueryDataPanel } from "./EnsureQueryDataPanel";

// QueryClient scopé à cette page (comme le store Zustand ou le Context
// des autres démos) — pas la façon idiomatique de faire dans une vraie
// app (un seul QueryClientProvider en racine), mais cohérent avec la
// philosophie "démo isolée par route" de ce sandbox.
function createDemoQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
    });
}

function ReactQueryPageContent() {
    const [staleTime, setStaleTime] = useState(2000);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
                        🗃️ fetchQuery vs ensureQueryData
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Même cache, même staleTime, deux méthodes — observe où elles divergent.
                    </p>
                </div>

                <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-4 shadow-md flex justify-center">
                    <StaleTimeControl value={staleTime} onChange={setStaleTime} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FetchQueryPanel staleTime={staleTime} />
                    <EnsureQueryDataPanel staleTime={staleTime} />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Pourquoi ça diverge ?</p>

                    <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                            <span className="font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs whitespace-nowrap mt-0.5">
                                fetchQuery
                            </span>
                            <p>
                                « If the query exists and the data is not invalidated or older than the
                                given <code>staleTime</code>, then the data from the cache will be
                                returned. » — sinon, refetch. <strong>À chaque appel.</strong>
                            </p>
                        </div>

                        <div className="flex gap-3 items-start">
                            <span className="font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs whitespace-nowrap mt-0.5">
                                ensureQueryData
                            </span>
                            <p>
                                « If the query does not exist, <code>queryClient.fetchQuery</code> will
                                be called. » Sous-entendu : si la query existe déjà — même périmée — elle
                                est retournée <strong>sans</strong> déclencher de fetch, sauf{" "}
                                <code>revalidateIfStale</code>.
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-400 italic text-xs pt-2 border-t border-gray-100">
                        Le call count ne monte qu'à la première résolution : clique une fois sur chaque
                        bouton, force le cache à devenir périmé (staleTime 0 ou "Invalidate"), puis
                        reclique — <code>fetchQuery</code> refetch, <code>ensureQueryData</code> non.
                    </p>
                </div>

                <div className="text-center">
                    <Link
                        to="/react-query/nav-demo"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white bg-opacity-80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-indigo-200 text-indigo-600 font-semibold"
                    >
                        Comparer via la navigation (loader) <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function ReactQueryPage() {
    const [queryClient] = useState(createDemoQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryPageContent />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
