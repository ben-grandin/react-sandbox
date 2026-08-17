import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: IndexRoute,
});

function IndexRoute() {
    return (
        <div className="space-y-3 text-sm text-gray-700">
            <p>
                Deux routes chargent la même donnée via un{" "}
                <code className="bg-gray-100 px-1 rounded">loader</code>, l'une avec{" "}
                <code className="bg-indigo-50 text-indigo-700 px-1 rounded">ensureQueryData</code>,
                l'autre avec <code className="bg-indigo-50 text-indigo-700 px-1 rounded">fetchQuery</code>.
            </p>
            <p>
                Navigue une première fois vers les deux (comportement identique), clique "Forcer périmé"
                en haut, puis re-navigue entre les deux — observe l'indicateur "Navigation en cours…".
            </p>
            <div className="flex gap-4">
                <Link to="/ensure" className="text-indigo-600 font-semibold hover:underline">
                    /ensure →
                </Link>
                <Link to="/fetch" className="text-indigo-600 font-semibold hover:underline">
                    /fetch →
                </Link>
            </div>
        </div>
    );
}
