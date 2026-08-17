import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { fetchServerSnapshot, type ServerSnapshot } from "./mockApi";

export type QueryDemoMethod = "fetchQuery" | "ensureQueryData";

type UseQueryDemoPanelOptions = {
    queryKeySuffix: string;
    method: QueryDemoMethod;
    staleTime: number;
    revalidateIfStale?: boolean;
    delayMs?: number;
};

type LastResult = {
    data: ServerSnapshot;
    wasNetworkCall: boolean;
    calledAt: number;
};

type CacheState = {
    exists: boolean;
    dataUpdatedAt: number;
    isInvalidated: boolean;
    isStaleByTime: boolean;
    isStale: boolean;
};

export type UseQueryDemoPanelResult = {
    queryKey: QueryKey;
    callCount: number;
    isPending: boolean;
    lastResult: LastResult | null;
    cacheState: CacheState;
    trigger: () => Promise<void>;
    clearCache: () => void;
    invalidateCache: () => void;
};

export function useQueryDemoPanel({
    queryKeySuffix,
    method,
    staleTime,
    revalidateIfStale = false,
    delayMs = 800,
}: UseQueryDemoPanelOptions): UseQueryDemoPanelResult {
    const queryClient = useQueryClient();
    const queryKey = useMemo<QueryKey>(() => ["query-demo", queryKeySuffix], [queryKeySuffix]);

    const callCountRef = useRef(0);
    const [callCount, setCallCount] = useState(0);
    const [isPending, setIsPending] = useState(false);
    const [lastResult, setLastResult] = useState<LastResult | null>(null);
    const [, forceTick] = useReducer((n: number) => n + 1, 0);

    // Force un re-render régulier pour que le badge FRESH -> STALE
    // bascule visible même sans action de l'utilisateur.
    useEffect(() => {
        const id = setInterval(forceTick, 250);
        return () => clearInterval(id);
    }, []);

    const trigger = useCallback(async () => {
        setIsPending(true);
        const beforeCount = callCountRef.current;

        // Incrémenté avant l'await : "un appel réseau a été déclenché"
        // doit être visible dès le clic, pas seulement à la résolution.
        const queryFn = () => {
            callCountRef.current += 1;
            setCallCount(callCountRef.current);
            return fetchServerSnapshot(delayMs);
        };

        try {
            const data =
                method === "fetchQuery"
                    ? await queryClient.fetchQuery({ queryKey, queryFn, staleTime })
                    : await queryClient.ensureQueryData({
                          queryKey,
                          queryFn,
                          staleTime,
                          revalidateIfStale,
                      });

            setLastResult({
                data,
                wasNetworkCall: callCountRef.current > beforeCount,
                calledAt: Date.now(),
            });
        } finally {
            setIsPending(false);
        }
    }, [method, queryClient, queryKey, staleTime, revalidateIfStale, delayMs]);

    const clearCache = useCallback(() => {
        queryClient.removeQueries({ queryKey, exact: true });
        callCountRef.current = 0;
        setCallCount(0);
        setLastResult(null);
        forceTick();
    }, [queryClient, queryKey]);

    const invalidateCache = useCallback(() => {
        queryClient.invalidateQueries({ queryKey, exact: true, refetchType: "none" });
        forceTick();
    }, [queryClient, queryKey]);

    const state = queryClient.getQueryState(queryKey);
    const dataUpdatedAt = state?.dataUpdatedAt ?? 0;
    const isInvalidated = state?.isInvalidated ?? false;
    const isStaleByTime =
        dataUpdatedAt === 0 || (staleTime !== Infinity && Date.now() - dataUpdatedAt >= staleTime);

    const cacheState: CacheState = {
        exists: dataUpdatedAt !== 0,
        dataUpdatedAt,
        isInvalidated,
        isStaleByTime,
        isStale: isInvalidated || isStaleByTime,
    };

    return { queryKey, callCount, isPending, lastResult, cacheState, trigger, clearCache, invalidateCache };
}
