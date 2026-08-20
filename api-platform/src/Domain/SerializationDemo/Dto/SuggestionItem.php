<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\Dto;

/**
 * Objet interne, volontairement sans #[Groups] : sert à illustrer le piège skolem-IRI quand on le
 * retourne tel quel depuis un State Provider (voir State/ApiPlatformNaiveObjectProvider). Reproduit
 * un bug réel rencontré sur PIC (PIC-5442) : un provider renvoyant des objets API Platform non
 * mappés produit un @id skolem (RDF/JSON-LD skolemization, https://www.w3.org/TR/rdf11-concepts/)
 * et, sans groupe de sérialisation correspondant, aucune propriété.
 */
final readonly class SuggestionItem
{
    public function __construct(
        public string $title,
        public string $description,
        public float $score,
    ) {
    }

    /**
     * @return list<self>
     */
    public static function samples(): array
    {
        return [
            new self(
                title: 'Incendies en Gironde : 500 hectares ravagés par les flammes',
                description: 'Trois communes évacuées depuis samedi, le feu progresse toujours.',
                score: 0.92,
            ),
            new self(
                title: 'CARTE. Où en sont les incendies en Gironde ?',
                description: 'Le point sur la progression du sinistre et les moyens engagés.',
                score: 0.87,
            ),
            new self(
                title: "Gironde : ce que l'on sait des incendies ce lundi",
                description: 'Bilan des dégâts et perspectives après le week-end.',
                score: 0.81,
            ),
        ];
    }
}
