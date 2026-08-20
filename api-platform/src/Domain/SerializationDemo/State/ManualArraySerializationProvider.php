<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Domain\SerializationDemo\Dto\SuggestionItem;

/**
 * Cas 1 - sérialisation maison : le tableau associatif est construit à la main. Aucun composant de
 * sérialisation impliqué.
 */
final class ManualArraySerializationProvider implements ProviderInterface
{
    /**
     * @return list<array{title: string, description: string, score: float}>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        return array_map(
            static fn (SuggestionItem $item): array => [
                'title' => $item->title,
                'description' => $item->description,
                'score' => $item->score,
            ],
            SuggestionItem::samples(),
        );
    }
}
