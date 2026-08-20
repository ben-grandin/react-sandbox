<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Domain\SerializationDemo\Dto\SuggestionItem;
use App\Domain\SerializationDemo\Dto\SuggestionItemOutput;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * Cas 2 - Symfony Serializer : délègue la construction du tableau au NormalizerInterface plutôt que
 * de recopier les clés à la main. Le résultat est toujours un tableau associatif (pas un objet),
 * donc aucun piège skolem-IRI ici.
 */
final class SymfonySerializerNormalizationProvider implements ProviderInterface
{
    public function __construct(
        private readonly NormalizerInterface $normalizer,
    ) {
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        return array_map(
            fn (SuggestionItem $item): array => $this->normalizer->normalize(
                SuggestionItemOutput::fromSuggestionItem($item),
                context: ['groups' => ['serialization-demo:read']],
            ),
            SuggestionItem::samples(),
        );
    }
}
