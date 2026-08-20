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
 * Ressource non persistée : 4 opérations qui reproduisent les 3 stratégies pour renvoyer une
 * collection depuis un State Provider (maison / Symfony Serializer / API Platform), avec un
 * sous-cas cassé et un sous-cas correct pour la 3e (le bug réel rencontré sur PIC-5442).
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
            provider: SymfonySerializerNormalizationProvider::class,
            normalizationContext: ['groups' => ['serialization-demo:read']],
        ),
        new GetCollection(
            uriTemplate: '/serialization-demo/api-platform-naive',
            description: "3a. API Platform, cas cassé : le provider retourne des objets SuggestionItem bruts (sans #[Groups] ni output:) - hydra:member vide.",
            provider: ApiPlatformNaiveObjectProvider::class,
            normalizationContext: ['groups' => ['serialization-demo:read']],
        ),
        new GetCollection(
            uriTemplate: '/serialization-demo/api-platform-dto',
            description: '3b. API Platform, cas correct : output: SuggestionItemOutput::class + #[Groups] sur le DTO.',
            provider: ApiPlatformDtoProvider::class,
            output: SuggestionItemOutput::class,
            normalizationContext: ['groups' => ['serialization-demo:read']],
        ),
    ],
)]
final class SerializationDemoResource
{
}
