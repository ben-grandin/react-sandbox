export function Test({ x }) {
    return (
        <div className="p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200 text-gray-300">
            <h2 className="text-xl font-bold mb-3 text-indigo-700">x: {x + ""}</h2>
            <p className="mb-3">
                <span className="font-semibold text-gray-700 mr-2">ternary :</span>
                {x ? (
                    <span>Vous avez {JSON.stringify(x)} messages non lus.</span>
                ) : null}
            </p>
            <p className="mb-3">
                <span className="font-semibold text-gray-700 mr-2">!! + &&</span>
                {!!x && <span>Vous avez {JSON.stringify(x)} messages non lus.</span>}
            </p>
            <p className="mb-1">
                <span className="font-semibold text-gray-700 mr-2">&& only</span>
                {x && <span>Vous avez {JSON.stringify(x)} messages non lus.</span>}
            </p>
        </div>
    );
}


export function SimpleTernary() {
    const unreadMessagesCount = [ 1, 0, null, undefined ];
    return (
        <main className="max-w-4xl mx-auto p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">Differences between ternary and && operator</h1>

            <div className="grid gap-4 md:grid-cols-2">
                {unreadMessagesCount.map((x, i) => (
                    <Test key={i} x={x} />
                ))}
            </div>
        </main>
    );
}
