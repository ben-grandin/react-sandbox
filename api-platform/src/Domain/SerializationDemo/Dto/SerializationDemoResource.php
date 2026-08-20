<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Domain\SerializationDemo\State\ApiPlatformDtoProvider;
use App\Domain\SerializationDemo\State\ApiPlatformNaiveObjectProvider;
use App\Domain\SerializationDemo\State\ManualArraySerializationProvider;
use App\Domain\SerializationDemo\State\SymfonySerializerNormalizationProvider;

/**
 * Ressource non persistée : 5 opérations qui reproduisent les stratégies pour renvoyer une
 * collection depuis un State Provider (maison / Symfony Serializer / API Platform), avec un
 * sous-cas cassé et deux contre-exemples corrects pour la 3e (le bug réel rencontré sur PIC-5442).
 */
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/serialization-demo/manual',
            description: '1. Sérialisation maison : tableau associatif construit à la main dans le provider.',
            provider: ManualArraySerializationProvider::class,
        ),
        new GetCollection(
            uriTemplate: '/serialization-demo/symfony-serializer',
            description: '2. Symfony Serializer : le provider appelle NormalizerInterface::normalize() sur un objet porteur de #[Groups].',
            normalizationContext: ['groups' => ['serialization-demo:read']],
            provider: SymfonySerializerNormalizationProvider::class,
        ),
        new GetCollection(
            uriTemplate: '/serialization-demo/api-platform-naive',
            description: "3a. API Platform, cas cassé : le provider retourne des objets SuggestionItem bruts (sans #[Groups] ni output:) - hydra:member vide.",
            normalizationContext: ['groups' => ['serialization-demo:read']],
            provider: ApiPlatformNaiveObjectProvider::class,
        ),
        new GetCollection(
            uriTemplate: '/serialization-demo/api-platform-dto',
            description: '3b. API Platform, cas correct : output: SuggestionItemOutput::class + #[Groups] sur le DTO.',
            normalizationContext: ['groups' => ['serialization-demo:read']],
            output: SuggestionItemOutput::class,
            provider: ApiPlatformDtoProvider::class,
        ),
        new GetCollection(
            uriTemplate: '/serialization-demo/no-context',
            description: "3c. API Platform, contre-exemple : MÊME provider que 3a (objets SuggestionItem bruts, sans #[Groups]), mais sans normalizationContext sur l'opération - aucun groupe actif, donc rien à filtrer. Prouve que le bug de 3a vient du groupe actif sans déclaration correspondante, pas du fait de renvoyer un objet brut.",
            provider: ApiPlatformNaiveObjectProvider::class,
        ),
    ],
)]
final class SerializationDemoResource
{
}
