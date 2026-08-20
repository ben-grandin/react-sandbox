<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\Dto;

use Symfony\Component\Serializer\Attribute\Groups;

/**
 * DTO de sortie déclaré via `output:` sur l'opération api-platform-dto : contrairement à
 * SuggestionItem, ses propriétés portent le groupe actif sur l'opération (`serialization-demo:read`),
 * donc rien n'est filtré à la normalisation.
 */
final readonly class SuggestionItemOutput
{
    public function __construct(
        #[Groups(['serialization-demo:read'])]
        public string $title,
        #[Groups(['serialization-demo:read'])]
        public string $description,
        #[Groups(['serialization-demo:read'])]
        public float $score,
    ) {
    }

    public static function fromSuggestionItem(SuggestionItem $item): self
    {
        return new self(
            title: $item->title,
            description: $item->description,
            score: $item->score,
        );
    }
}
