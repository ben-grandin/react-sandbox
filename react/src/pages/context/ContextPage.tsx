import { createContext, useContext } from "react";

type Content = { title: string };

// La valeur par défaut est utilisée uniquement quand useContext est appelé HORS Provider
const ContentContext = createContext<Content>({ title: "valeur par défaut" });

const InsideProvider = () => {
    const content = useContext(ContentContext);
    return (
        <div className="p-4 bg-green-100 rounded-lg">
            <p className="font-semibold text-green-800">Dans le Provider</p>
            <p className="text-green-700">title : <code>"{content.title}"</code></p>
        </div>
    );
};

const OutsideProvider = () => {
    const content = useContext(ContentContext);
    return (
        <div className="p-4 bg-red-100 rounded-lg">
            <p className="font-semibold text-red-800">Hors Provider</p>
            <p className="text-red-700">title : <code>"{content.title}"</code></p>
        </div>
    );
};

export const ContextPage = () => (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">createContext — demo</h1>

        <OutsideProvider />

        <ContentContext.Provider value={{ title: "valeur du Provider" }}>
            <InsideProvider />
        </ContentContext.Provider>
    </div>
);
