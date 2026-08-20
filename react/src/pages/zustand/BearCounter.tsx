import { useBearStore } from "./bearStore";

export function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  return (
    <div className="flex-1 flex items-center justify-center bg-indigo-50 rounded-xl p-6">
      <span className="text-6xl font-extrabold text-indigo-600">{bears}</span>
      <span className="ml-3 text-gray-500 text-lg">ours</span>
    </div>
  );
}
