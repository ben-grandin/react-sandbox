import { useState } from "react";
import { Link } from "react-router";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ApiError, apiFetch } from "../../lib/api";
import type { HydraCollection } from "../../lib/api";

type Case = {
    path: string;
    title: string;
    verdict: "ok" | "broken";
    explanation: string;
};

const CASES: Case[] = [
    {
        path: "/serialization-demo/manual",
        title: "1. Sérialisation maison",
        verdict: "ok",
        explanation: "Le provider construit un tableau associatif à la main. Aucun composant de sérialisation impliqué.",
    },
    {
        path: "/serialization-demo/symfony-serializer",
        title: "2. Symfony Serializer",
        verdict: "ok",
        explanation:
            "Le provider délègue à NormalizerInterface::normalize() sur un objet porteur de #[Groups]. Toujours un tableau en sortie, donc pas de piège skolem-IRI.",
    },
    {
        path: "/serialization-demo/api-platform-naive",
        title: "3a. API Platform — objet brut (cassé)",
        verdict: "broken",
        explanation:
            "Le provider retourne l'objet SuggestionItem tel quel, sans #[Groups] ni output:. Avec un groupe de normalisation actif sur l'opération, ObjectNormalizer filtre TOUTES les propriétés : hydra:member finit vide.",
    },
    {
        path: "/serialization-demo/api-platform-dto",
        title: "3b. API Platform — output DTO (correct)",
        verdict: "ok",
        explanation:
            "output: SuggestionItemOutput::class + #[Groups] sur le DTO. Les propriétés survivent au filtrage, mais un @id skolem apparaît (RDF skolemization) : un objet API Platform hors ressource n'a pas d'identité propre.",
    },
];

function createDemoQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
}

function CaseCard({ definition }: { definition: Case }) {
    const { data, error, isError, isLoading } = useQuery({
        queryKey: ["serialization-demo", definition.path],
        queryFn: () => apiFetch<HydraCollection<unknown>>(definition.path),
    });

    const borderClass = definition.verdict === "broken" ? "border-red-300" : "border-emerald-300";
    const badgeClass =
        definition.verdict === "broken" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700";

    return (
        <div className={`bg-white rounded-xl shadow-md border-2 ${borderClass} p-6 space-y-3`}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-gray-800">{definition.title}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeClass}`}>
                    {definition.verdict === "broken" ? "cassé" : "correct"}
                </span>
            </div>
            <p className="text-sm text-gray-600">{definition.explanation}</p>

            {isLoading && <p className="text-gray-400 text-sm">Chargement…</p>}

            {isError && error instanceof ApiError && (
                <p className="text-red-600 text-sm">
                    Erreur HTTP {error.status} — l'API tourne-t-elle ? `make up` à la racine.
                </p>
            )}

            {data && (
                <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto">
                    {JSON.stringify(data.member, null, 2)}
                </pre>
            )}
        </div>
    );
}

function SerializationDemoPageContent() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Sérialisation : maison vs Symfony vs API Platform</h1>
                    <p className="text-gray-600">
                        Même donnée, 4 façons de la renvoyer depuis un State Provider — un seul cas est vraiment cassé.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CASES.map((definition) => (
                        <CaseCard key={definition.path} definition={definition} />
                    ))}
                </div>

                <div className="text-center">
                    <Link to="/" className="text-indigo-500 hover:text-indigo-700 text-sm">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function SerializationDemoPage() {
    const [queryClient] = useState(createDemoQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <SerializationDemoPageContent />
        </QueryClientProvider>
    );
}
