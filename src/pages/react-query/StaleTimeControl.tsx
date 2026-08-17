const STALE_TIME_OPTIONS = [
    { label: "0ms — toujours périmé", value: 0 },
    { label: "2000ms", value: 2000 },
    { label: "10000ms", value: 10000 },
    { label: "Infinity — jamais périmé", value: Infinity },
];

type StaleTimeControlProps = {
    value: number;
    onChange: (value: number) => void;
};

export function StaleTimeControl({ value, onChange }: StaleTimeControlProps) {
    return (
        <label className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700">
            <span className="font-semibold">staleTime partagé</span>
            <select
                value={value === Infinity ? "Infinity" : value}
                onChange={(e) => onChange(e.target.value === "Infinity" ? Infinity : Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white font-mono text-sm"
            >
                {STALE_TIME_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value === Infinity ? "Infinity" : option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
