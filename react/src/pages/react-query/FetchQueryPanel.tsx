import { useQueryDemoPanel } from "./useQueryDemoPanel";
import { CacheStateBadge } from "./CacheStateBadge";

type FetchQueryPanelProps = {
    staleTime: number;
    delayMs?: number;
};

export function FetchQueryPanel({ staleTime, delayMs }: FetchQueryPanelProps) {
    const panel = useQueryDemoPanel({ queryKeySuffix: "fetch-query", method: "fetchQuery", staleTime, delayMs });

    return (
        <div
            data-testid="fetch-query-panel"
            className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-md space-y-4"
        >
            <div>
                <h2 className="text-xl font-bold text-gray-800">fetchQuery</h2>
                <p className="text-gray-500 text-sm">
                    Réévalue <code className="bg-indigo-50 text-indigo-700 px-1 rounded">staleTime</code> à
                    chaque appel — refetch si la donnée est périmée.
                </p>
            </div>

            <button
                onClick={() => void panel.trigger()}
                disabled={panel.isPending}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            >
                {panel.isPending ? "Chargement…" : "Call fetchQuery()"}
            </button>

            <CacheStateBadge result={panel} />

            <div className="flex gap-2 text-xs">
                <button
                    onClick={panel.invalidateCache}
                    className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-semibold hover:bg-orange-100"
                >
                    Invalidate cache
                </button>
                <button
                    onClick={panel.clearCache}
                    className="px-3 py-1.5 rounded-lg bg-white text-gray-600 border border-gray-200 font-semibold hover:bg-gray-50"
                >
                    Clear cache
                </button>
            </div>
        </div>
    );
}
