import { useState } from "react";
import { Link } from "react-router";
import { QueryClient, QueryClientProvider, keepPreviousData, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ApiError, apiFetch } from "../../lib/api";
import type { HydraCollection } from "../../lib/api";

type Snapshot = {
    "@id": string;
    id: number;
    position: number;
    label: string;
    createdAt: string;
};

const PER_PAGE = 5;

// QueryClient scopé à cette page — même convention que ReactQueryPage.
function createDemoQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
}

function ApiPaginationPageContent() {
    const [page, setPage] = useState(1);

    const { data, error, isError, isPlaceholderData } = useQuery({
        queryKey: ["pagination", "snapshots", page],
        queryFn: () =>
            apiFetch<HydraCollection<Snapshot>>(`/pagination/snapshots?page=${page}&itemsPerPage=${PER_PAGE}`),
        placeholderData: keepPreviousData,
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagination Hydra</h1>
                    <p className="text-gray-600">
                        Collection paginée API Platform — <code>totalItems</code>, <code>member</code>,{" "}
                        <code>view.next</code>
                    </p>
                </div>

                {isError && error instanceof ApiError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-2">
                        <p className="text-red-700 font-semibold">Erreur HTTP {error.status}</p>
                        <p className="text-red-600 text-sm">L'API tourne-t-elle ? Essaie `make up` à la racine.</p>
                    </div>
                )}

                {data && (
                    <div className={`space-y-4 transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`}>
                        <p className="text-center text-gray-600 text-sm">
                            {data.totalItems} snapshots au total — page {page}
                        </p>

                        {data.member.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Aucun résultat.</p>
                        ) : (
                            <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-100">
                                {data.member.map((snapshot) => (
                                    <li key={snapshot["@id"]} className="p-4 flex justify-between items-center">
                                        <span className="font-medium text-gray-800">{snapshot.label}</span>
                                        <span className="text-gray-400 text-sm">#{snapshot.position}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                disabled={!data.view?.previous}
                                onClick={() => setPage((current) => current - 1)}
                                className="px-4 py-2 rounded-lg bg-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-50"
                            >
                                ← Précédent
                            </button>
                            <button
                                type="button"
                                disabled={!data.view?.next}
                                onClick={() => setPage((current) => current + 1)}
                                className="px-4 py-2 rounded-lg bg-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-50"
                            >
                                Suivant →
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <Link to="/" className="text-indigo-500 hover:text-indigo-700 text-sm">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function ApiPaginationPage() {
    const [queryClient] = useState(createDemoQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <ApiPaginationPageContent />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
