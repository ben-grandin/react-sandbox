import type { ServerSnapshot } from "../mockApi";

type SnapshotCardProps = {
    method: "ensureQueryData" | "fetchQuery";
    snapshot: ServerSnapshot;
    note: string;
};

export function SnapshotCard({ method, snapshot, note }: SnapshotCardProps) {
    return (
        <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800 font-mono">{method}()</h2>

            <div className="bg-indigo-50 rounded-lg p-4 font-mono text-sm text-indigo-800 space-y-1">
                <div>
                    valeur : <strong>{snapshot.value}</strong>
                </div>
                <div>
                    générée à : <strong>{new Date(snapshot.generatedAt).toLocaleTimeString()}</strong>
                </div>
            </div>

            <p className="text-sm text-gray-600">{note}</p>
        </div>
    );
}
