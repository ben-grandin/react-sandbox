import { useState } from "react";
import { useQueryDemoPanel } from "./useQueryDemoPanel";
import { CacheStateBadge } from "./CacheStateBadge";

type EnsureQueryDataPanelProps = {
    staleTime: number;
    delayMs?: number;
};

export function EnsureQueryDataPanel({ staleTime, delayMs }: EnsureQueryDataPanelProps) {
    const [revalidateIfStale, setRevalidateIfStale] = useState(false);
    const panel = useQueryDemoPanel({
        queryKeySuffix: "ensure-query-data",
        method: "ensureQueryData",
        staleTime,
        revalidateIfStale,
        delayMs,
    });

    return (
        <div
            data-testid="ensure-query-data-panel"
            className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-md space-y-4"
        >
            <div>
                <h2 className="text-xl font-bold text-gray-800">ensureQueryData</h2>
                <p className="text-gray-500 text-sm">
                    Retourne le cache s'il existe, <strong>peu importe sa fraîcheur</strong> — ne fetch que
                    si aucune entrée n'existe.
                </p>
            </div>

            <button
                onClick={() => void panel.trigger()}
                disabled={panel.isPending}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            >
                {panel.isPending ? "Chargement…" : "Call ensureQueryData()"}
            </button>

            <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                    type="checkbox"
                    checked={revalidateIfStale}
                    onChange={(e) => setRevalidateIfStale(e.target.checked)}
                />
                <code className="bg-indigo-50 text-indigo-700 px-1 rounded">revalidateIfStale</code>
                — refetch en arrière-plan si périmé, sans bloquer le retour du cache
            </label>

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
