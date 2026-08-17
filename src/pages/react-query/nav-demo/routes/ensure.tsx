import { createFileRoute } from "@tanstack/react-router";
import { NAV_DEMO_QUERY_KEY, NAV_DEMO_STALE_TIME, fetchNavDemoSnapshot } from "../queryOptions";
import { SnapshotCard } from "../SnapshotCard";

export const Route = createFileRoute("/ensure")({
    loader: ({ context }) =>
        context.queryClient.ensureQueryData({
            queryKey: NAV_DEMO_QUERY_KEY,
            queryFn: fetchNavDemoSnapshot,
            staleTime: NAV_DEMO_STALE_TIME,
        }),
    component: EnsureRoute,
});

function EnsureRoute() {
    const snapshot = Route.useLoaderData();

    return (
        <SnapshotCard
            method="ensureQueryData"
            snapshot={snapshot}
            note="Si une entrée existe déjà en cache — même périmée — elle est retournée sans attendre le réseau : la navigation vers cette route est instantanée."
        />
    );
}
