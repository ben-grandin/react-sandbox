<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Domain\SerializationDemo\Dto\ExternalFeedPayload;
use App\Domain\SerializationDemo\Dto\SuggestionItem;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

/**
 * Cas 4a - CASSÉ : dénormalise le payload externe (4 champs, dont "urgency") vers SuggestionItem
 * (3 propriétés fixes, pas de champ "urgency"). ALLOW_EXTRA_ATTRIBUTES vaut true par défaut
 * (Symfony\Component\Serializer\Normalizer\AbstractNormalizer::ALLOW_EXTRA_ATTRIBUTES) : toute clé
 * du payload sans propriété correspondante déclenche un `continue` dans
 * AbstractObjectNormalizer::denormalize() — la valeur est lue puis jetée, jamais assignée. Le
 * résultat de ce provider n'a physiquement plus aucune trace d'"urgency" : il a disparu au moment
 * du denormalize(), pas au moment de la sérialisation de la réponse API Platform.
 */
final class DenormalizeDropsExtraProvider implements ProviderInterface
{
    public function __construct(
        private readonly DenormalizerInterface $denormalizer,
    ) {
    }

    /**
     * @return list<SuggestionItem>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        return $this->denormalizer->denormalize(ExternalFeedPayload::samples(), SuggestionItem::class.'[]');
    }
}
