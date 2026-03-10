import { useBearStore } from "./bearStore";

export function BearControls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation);
  const removeAllBears = useBearStore((state) => state.removeAllBears);
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={increasePopulation}
        className="px-6 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:shadow-md hover:scale-105 transition-all duration-200"
      >
        + 1 ours
      </button>
      <button
        onClick={removeAllBears}
        className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold shadow hover:shadow-md hover:scale-105 transition-all duration-200"
      >
        Vider
      </button>
    </div>
  );
}
