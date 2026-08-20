<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Domain\SerializationDemo\Dto\SuggestionItem;
use App\Domain\SerializationDemo\Dto\SuggestionItemOutput;

/**
 * Cas 3b - API Platform, la façon correcte : output: SuggestionItemOutput::class sur l'opération +
 * #[Groups] sur le DTO. Les propriétés survivent au filtrage ; un @id skolem reste présent (RDF
 * skolemization, cf. Dto/SuggestionItem.php), mais les données ne disparaissent plus.
 */
final class ApiPlatformDtoProvider implements ProviderInterface
{
    /**
     * @return list<SuggestionItemOutput>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        return array_map(SuggestionItemOutput::fromSuggestionItem(...), SuggestionItem::samples());
    }
}
