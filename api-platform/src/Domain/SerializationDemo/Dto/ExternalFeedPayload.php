<?php

declare(strict_types=1);

namespace App\Domain\SerializationDemo\Dto;

/**
 * Simule la réponse JSON déjà décodée (json_decode(..., true)) d'un micro-service tiers, dont le
 * contrat peut évoluer sans préavis. Mêmes 3 champs que SuggestionItem::samples() (title,
 * description, score), plus un 4e champ ("urgency") que le micro-service a ajouté un jour sans que
 * personne côté PHP ne le sache — exactement la situation de TitraillePredicter
 * (pic-backoffice-api) : le contrat externe (TitrailleSuggestion : titre, type, proposition)
 * n'a que 3 propriétés déclarées, sans garantie que le micro-service ne renvoie jamais autre chose.
 */
final class ExternalFeedPayload
{
    /**
     * @return list<array{title: string, description: string, score: float, urgency: string}>
     */
    public static function samples(): array
    {
        return [
            [
                'title' => 'Incendies en Gironde : 500 hectares ravagés par les flammes',
                'description' => 'Trois communes évacuées depuis samedi, le feu progresse toujours.',
                'score' => 0.92,
                'urgency' => 'high',
            ],
            [
                'title' => 'CARTE. Où en sont les incendies en Gironde ?',
                'description' => 'Le point sur la progression du sinistre et les moyens engagés.',
                'score' => 0.87,
                'urgency' => 'medium',
            ],
            [
                'title' => "Gironde : ce que l'on sait des incendies ce lundi",
                'description' => 'Bilan des dégâts et perspectives après le week-end.',
                'score' => 0.81,
                'urgency' => 'medium',
            ],
        ];
    }
}
