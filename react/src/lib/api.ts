const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

/**
 * Full backend origin — for links that navigate away from the SPA entirely
 * (e.g. the Swagger UI link) rather than going through the same-origin Vite
 * proxy. Override in `.env.local` (gitignored) when browsing the front under
 * a custom hostname, e.g. `VITE_API_ORIGIN=http://api.sandbox.local:8000`.
 */
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? "http://localhost:8000";

export type HydraCollection<T> = {
    "@context": string;
    "@id": string;
    "@type": "Collection";
    totalItems: number;
    member: T[];
    view?: {
        "@id": string;
        "@type": "PartialCollectionView";
        first?: string;
        last?: string;
        next?: string;
        previous?: string;
    };
};

export class ApiError extends Error {
    constructor(
        readonly status: number,
        readonly path: string,
    ) {
        super(`${path} → HTTP ${status}`);
        this.name = "ApiError";
    }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    // application/ld+json, not application/json: the default API Platform install only
    // registers the jsonld format (a plain-JSON Accept gets a 406), and only the JSON-LD
    // representation carries totalItems / view, which is what pagination needs.
    const response = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: { Accept: "application/ld+json", ...init?.headers },
    });

    if (!response.ok) throw new ApiError(response.status, path);

    return (await response.json()) as T;
}
