<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Domain\SerializationDemo\Dto\ExternalFeedPayload;

/**
 * Cas 4b - CORRECT (pass-through) : même payload que 4a, mais jamais passé dans denormalize().
 *
 * Vérifié avant d'écrire ce commentaire, pas supposé : denormalize() n'a AUCUNE cible qui
 * préserve un champ inconnu sans le filtrer.
 * - denormalize($data, 'array') lève "Could not denormalize object of type array, no supporting
 *   normalizer found" - 'array' n'est pas un type de classe, aucun normalizer ne le prend en charge.
 * - denormalize($data, \stdClass::class) ne lève rien mais rend un stdClass avec ZÉRO propriété
 *   assignée - pire que 4a, pas mieux.
 *
 * La seule façon lossless de garder "urgency" est donc de ne jamais forcer le payload dans une
 * forme typée : le tableau déjà décodé (json_decode($response, true) dans un vrai provider HTTP)
 * porte déjà tout ce que le micro-service a renvoyé, sans qu'aucun jeu de propriétés déclaré ait
 * l'occasion de filtrer quoi que ce soit.
 *
 * Compromis assumé : simplicité de l'illustration plutôt qu'exhaustivité typée. L'alternative
 * production-grade — un denormalizer custom qui type les champs connus ET range le reste dans une
 * propriété publique `$extra` — capture la même donnée sans rien perdre tout en gardant un objet
 * typé dans le code PHP, mais demande d'écrire un DenormalizerInterface complet (gestion de la
 * récursion, du format, etc.) : hors scope d'une démo qui vise le mécanisme, pas la fonctionnalité
 * complète. À reprendre si un jour ce sandbox a besoin de montrer concrètement cette variante.
 */
final class DenormalizeArrayPassthroughProvider implements ProviderInterface
{
    /**
     * @return list<array<string, mixed>>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        return ExternalFeedPayload::samples();
    }
}
