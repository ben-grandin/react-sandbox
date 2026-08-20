import { useLayoutEffect, useRef, useState } from "react";

function useMeasure() {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            setWidth(Math.round(el.getBoundingClientRect().width));
        });
        observer.observe(el);
        setWidth(Math.round(el.getBoundingClientRect().width));

        return () => observer.disconnect();
    }, []);

    return { ref, width };
}

// Texte non-wrappable : min-content = max-content ≈ 300px
// → sans width explicite sur le parent, l'item résiste au shrink
const NOWRAP_CONTENT = `const paradox = "flex-shrink is subtle"`;

export function FlexShrinkDemo() {
    const [withWidth, setWithWidth] = useState(false);
    const leftMeasure = useMeasure();
    const rightMeasure = useMeasure();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <div className="max-w-3xl mx-auto space-y-8">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        Le paradoxe <code className="text-rose-600">width</code> + flex-shrink
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Déclarer une{" "}
                        <code className="bg-white px-1 rounded text-gray-800 border border-gray-200">
                            width
                        </code>{" "}
                        peut paradoxalement <strong>réduire</strong> la taille effective d'un flex
                        item — bien en dessous de sa taille naturelle.
                    </p>
                </div>

                {/* Toggle */}
                <button
                    onClick={() => setWithWidth((w) => !w)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-mono font-semibold border-2 transition-all shadow-sm ${
                        withWidth
                            ? "bg-orange-50 text-orange-700 border-orange-400"
                            : "bg-white text-gray-600 border-gray-300"
                    }`}
                >
                    {withWidth ? "right child: width: 160px ✓" : "right child: pas de width"}
                </button>

                {/* Flex container : 640px, left prend 490px → 142px disponibles pour right */}
                <div className="bg-white rounded-2xl shadow-md">
                    <div className="text-xs text-gray-400 font-mono px-4 py-2 border-b border-gray-100">
                        container · 640px · display: flex · overflow: visible
                    </div>

                    <div className="p-3 overflow-visible" style={{ width: 640 }}>
                        <div className="flex gap-2 overflow-visible">

                            {/* Left : prend 490px, ne shrink pas → crée la pression */}
                            <div
                                ref={leftMeasure.ref}
                                className="bg-indigo-100 rounded-xl p-4 flex flex-col items-center justify-center gap-1 flex-shrink-0 text-center"
                                style={{ width: 490 }}
                            >
                                <span className="text-xs text-indigo-400 font-mono">left child</span>
                                <span className="text-xs text-indigo-400 font-mono">flex-shrink: 0</span>
                                <span className="text-lg font-bold text-indigo-700 tabular-nums">
                                    {leftMeasure.width}px
                                </span>
                            </div>

                            {/* Right : le sujet de la démo */}
                            <div
                                ref={rightMeasure.ref}
                                className={`bg-rose-50 rounded-xl p-3 flex flex-col gap-3 border-2 transition-all duration-300 ${
                                    withWidth ? "border-orange-300" : "border-rose-200"
                                }`}
                                style={withWidth ? { width: 160 } : undefined}
                            >
                                {/* Contenu non-wrappable → min-content ≈ 300px
                                    Sans width : min-width:auto = 300px → résiste au shrink
                                    Avec width 160px : min-width:auto = min(300, 160) = 160px → peut shrink */}
                                <code className="whitespace-nowrap text-xs text-rose-800 bg-rose-100 px-2 py-1 rounded">
                                    {NOWRAP_CONTENT}
                                </code>

                                <div className="text-xs font-mono border-t border-rose-200 pt-2 space-y-0.5">
                                    <span className="text-rose-400">right child</span>
                                    {withWidth && (
                                        <div className="text-orange-500">width: 160px</div>
                                    )}
                                    <div
                                        className={`text-2xl font-bold tabular-nums ${
                                            withWidth ? "text-orange-600" : "text-rose-600"
                                        }`}
                                    >
                                        {rightMeasure.width}px
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explication */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Pourquoi ?</p>

                    <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                            <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs whitespace-nowrap mt-0.5">
                                sans width
                            </span>
                            <p>
                                <code>min-width: auto</code> = min-content du contenu (~300px, le
                                texte ne wrappant pas). Flex-shrink ne peut pas descendre en
                                dessous → l'item <strong>résiste</strong> à toute compression.
                            </p>
                        </div>

                        <div className="flex gap-3 items-start">
                            <span className="font-mono bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs whitespace-nowrap mt-0.5">
                                width: 160px
                            </span>
                            <p>
                                <code>min-width: auto</code> = min(min-content ~300px,{" "}
                                <strong>160px</strong>) = <strong>160px</strong>. Le floor
                                s'effondre. Flex-shrink peut maintenant comprimer l'item à 160px —{" "}
                                <strong>bien en dessous de sa taille naturelle</strong>.
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-400 italic text-xs pt-2 border-t border-gray-100">
                        La règle CSS : <code>min-width: auto</code> sur un flex item = min(min-content,
                        valeur de width si définie). Setter une width peut donc baisser le plancher
                        et laisser flex-shrink faire son travail.
                    </p>
                </div>
            </div>
        </div>
    );
}
