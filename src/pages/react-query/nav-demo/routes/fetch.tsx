import { createFileRoute } from "@tanstack/react-router";
import { NAV_DEMO_QUERY_KEY, NAV_DEMO_STALE_TIME, fetchNavDemoSnapshot } from "../queryOptions";
import { SnapshotCard } from "../SnapshotCard";

export const Route = createFileRoute("/fetch")({
    loader: ({ context }) =>
        context.queryClient.fetchQuery({
            queryKey: NAV_DEMO_QUERY_KEY,
            queryFn: fetchNavDemoSnapshot,
            staleTime: NAV_DEMO_STALE_TIME,
        }),
    component: FetchRoute,
});

function FetchRoute() {
    const snapshot = Route.useLoaderData();

    return (
        <SnapshotCard
            method="fetchQuery"
            snapshot={snapshot}
            note="Si la donnée en cache est périmée, le loader attend une réponse réseau avant de résoudre — la navigation vers cette route se met en pause (regarde l'indicateur en haut)."
        />
    );
}
