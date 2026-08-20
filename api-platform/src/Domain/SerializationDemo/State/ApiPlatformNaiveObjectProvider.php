<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Domain\SerializationDemo\Dto\SuggestionItem;

/**
 * Cas 3a - API Platform, reproduction du bug PIC-5442 : retourne des objets SuggestionItem bruts,
 * sans #[Groups] ni output:. Avec normalizationContext.groups actif sur l'opération,
 * ObjectNormalizer filtre TOUTES les propriétés faute de groupe correspondant -> hydra:member
 * contient des objets vides, chacun avec un @id skolem aléatoire.
 */
final class ApiPlatformNaiveObjectProvider implements ProviderInterface
{
    /**
     * @return list<SuggestionItem>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        return SuggestionItem::samples();
    }
}
