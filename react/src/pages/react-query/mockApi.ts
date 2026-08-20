export type ServerSnapshot = {
    value: string;
    generatedAt: number;
};

// Délai artificiel pour que les états de chargement soient visibles,
// et une valeur aléatoire + timestamp pour distinguer à l'oeil
// "nouvelle donnée réseau" de "donnée servie depuis le cache".
export async function fetchServerSnapshot(delayMs = 800): Promise<ServerSnapshot> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return {
        value: Math.random().toString(36).slice(2, 8),
        generatedAt: Date.now(),
    };
}
