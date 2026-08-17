import type { UseQueryDemoPanelResult } from "./useQueryDemoPanel";

type CacheStateBadgeProps = {
    result: Pick<UseQueryDemoPanelResult, "cacheState" | "callCount" | "lastResult">;
};

function badgeStyle(cacheState: UseQueryDemoPanelResult["cacheState"]) {
    if (!cacheState.exists) return "bg-gray-100 text-gray-500 border-gray-300";
    if (cacheState.isInvalidated) return "bg-red-100 text-red-700 border-red-300";
    if (cacheState.isStaleByTime) return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-emerald-100 text-emerald-700 border-emerald-300";
}

function badgeLabel(cacheState: UseQueryDemoPanelResult["cacheState"]) {
    if (!cacheState.exists) return "NO CACHE";
    if (cacheState.isInvalidated) return "INVALIDATED";
    if (cacheState.isStaleByTime) return "STALE";
    return "FRESH";
}

export function CacheStateBadge({ result }: CacheStateBadgeProps) {
    const { cacheState, callCount, lastResult } = result;
    const age = cacheState.exists ? Math.round((Date.now() - cacheState.dataUpdatedAt) / 1000) : null;

    return (
        <div className="space-y-2 text-sm">
            <span
                className={`inline-block font-mono font-semibold text-xs px-2 py-1 rounded-full border ${badgeStyle(cacheState)}`}
            >
                {badgeLabel(cacheState)}
            </span>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-gray-600 font-mono text-xs">
                <span className="text-gray-400">appels réseau</span>
                <span data-testid="call-count" className="font-semibold text-gray-800">
                    {callCount}
                </span>

                <span className="text-gray-400">valeur</span>
                <span className="font-semibold text-gray-800">{lastResult?.data.value ?? "—"}</span>

                <span className="text-gray-400">âge du cache</span>
                <span className="font-semibold text-gray-800">{age !== null ? `${age}s` : "—"}</span>

                <span className="text-gray-400">dernier appel</span>
                <span className="font-semibold text-gray-800">
                    {lastResult ? (lastResult.wasNetworkCall ? "réseau" : "cache") : "—"}
                </span>
            </div>
        </div>
    );
}
