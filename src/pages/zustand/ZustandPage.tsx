import { BearControls } from "./BearControls";
import { BearCounter } from "./BearCounter";

export function ZustandPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-100 to-purple-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600 mb-2">
                        🐻 Zustand POC
                    </h1>
                    <p className="text-gray-600 text-lg">
                        State management with store, selectors and re-renders
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Store basique */}
                    <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-md">
                        <h2 className="text-2xl font-bold mb-1 text-gray-800">Store</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            <code className="bg-indigo-50 text-indigo-700 px-1 rounded">useBearStore</code> — état
                            global partagé entre les deux composants ci-dessous
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <BearCounter />
                            <BearControls />
                        </div>
                    </div>

                    {/* Sélecteur */}
                    <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-md">
                        <h2 className="text-2xl font-bold mb-1 text-gray-800">Sélecteurs</h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Un sélecteur extrait un slice précis du store. Le composant ne re-render que si <strong>ce
                            slice</strong> change.
                        </p>
                        <pre className="bg-indigo-50 text-indigo-800 text-sm rounded-lg p-4 overflow-auto">
{`// ✅ Re-render uniquement quand \`bears\` change
const bears = useBearStore((state) => state.bears)

// ✅ Ne re-render JAMAIS (les actions sont stables)
const increasePopulation = useBearStore((state) => state.increasePopulation)`}
            </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
