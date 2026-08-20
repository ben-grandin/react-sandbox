# Formes de réponse API Platform : item JSON-LD vs collection Hydra

Retour d'expérience issu du bug titraille (PIC-5442). À lire avant d'écrire ou de modifier un State Provider qui renvoie autre chose qu'une entité Doctrine.

## La règle qui décide de tout

**C'est le type PHP retourné par le provider qui décide seul de la forme sérialisée.** Ni le verbe HTTP, ni le type d'opération (`Post` vs `GetCollection`), ni l'attribut `output:` n'y changent quoi que ce soit.

Deux normalizers se disputent la valeur retournée, et leur arbitrage tient en deux lignes de vendor :

```php
// vendor/api-platform/serializer/AbstractItemNormalizer.php
public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
{
    if (!\is_object($data) || is_iterable($data)) {
        return false;   // refuse TOUT itérable
    }
    // …
}

// vendor/api-platform/serializer/AbstractCollectionNormalizer.php
public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
{
    return static::FORMAT === $format && is_iterable($data);   // accepte TOUT itérable
}
```

Un `array` PHP est `is_iterable`. Donc **tout provider qui retourne un array produit une collection Hydra**, y compris un array associatif à une seule clé.

## Le piège concret

`CollectionNormalizer::getItemsData()` (`vendor/api-platform/hydra/Serializer/CollectionNormalizer.php`) itère sans jamais lire les clés :

```php
foreach ($object as $obj) {
    $data['hydra:member'][] = $this->normalizer->normalize($obj, $format, $context);
}
```

Conséquence pour un provider qui retournait `['suggestions' => $suggestions]` :

- le `foreach` ne tourne **qu'une fois** (une seule clé de premier niveau) ;
- la clé `suggestions` **disparaît** ;
- l'unique élément poussé dans `hydra:member` est le tableau complet des suggestions.

Le client recevait donc une imbrication parasite :

```jsonc
// AVANT — provider: return ['suggestions' => $suggestions];
{
  "@context": "/contexts/Content",
  "@type": "hydra:Collection",
  "hydra:totalItems": 1,
  "hydra:member": [ [ {"titre": "…"}, {"titre": "…"}, {"titre": "…"} ] ]
}

// APRÈS — provider: return $suggestions;
{
  "@context": "/contexts/Content",
  "@type": "hydra:Collection",
  "hydra:totalItems": 3,
  "hydra:member": [ {"titre": "…"}, {"titre": "…"}, {"titre": "…"} ]
}
```

## Tableau de décision

| Forme voulue | Ce que le provider doit retourner |
|---|---|
| Collection Hydra (`hydra:member` = liste) | une **liste plate** (`array<int, …>`) ou un `iterable` |
| Item JSON-LD (`@id`/`@type` + propriétés) | un **objet**, jamais un array |
| Objet avec une propriété tableau (`{"suggestions": […]}`) | un **DTO** + `output: MonDto::class` sur l'opération — [doc AP4](https://api-platform.com/docs/v4.1/core/dto/) |
| JSON brut, hors pipeline Hydra | un `controller:` renvoyant une `JsonResponse` (précédent maison : `src/Controller/EntityGetPreviewUrl.php`) |

Il n'existe **aucun** DTO derrière `output:` dans ce repo à ce jour : la seule occurrence de `output:` est `src/Entity/Cms/Event.php` (`output: Event::class`, auto-référentiel).

## Objet ou tableau dans `hydra:member` : la différence coûte cher

Retourner des **objets** plutôt que des tableaux change la réponse, même à propriétés identiques. JSON-LD est un format de **données liées** : tout nœud objet du graphe doit porter une identité et un type. Un objet qui n'est pas une `#[ApiResource]` n'a pas d'IRI, alors API Platform en forge une — une **IRI skolem** (`SkolemIriConverter`) :

```jsonc
// Provider renvoyant des tableaux
{ "type": "Verbatim + contexte", "titre": "…" }

// Provider renvoyant des objets — mêmes propriétés
{
  "@type": "TitrailleSuggestion",
  "@id": "/.well-known/genid/849ecbb32e863cc5e829",   // aléatoire à chaque appel
  "titre": "…",
  "type": "Verbatim + contexte"
}
```

Un tableau n'est pas un nœud, c'est une simple map : il est invisible pour JSON-LD et ne reçoit rien.

Deux autres surprises avec les objets :

- **Sans `#[Groups]`, l'objet sort vide** (`hydra:member: [{}, {}]`). L'opération hérite du `use_groups` de la ressource via `src/Serializer/ContextBuilder.php`, et `extraProperties: []` sur l'opération ne neutralise pas cet héritage.
- **L'`@id` skolem n'est pas désactivable par configuration.** `gen_id` est lu dans `$context['output']` (`JsonLdContextTrait.php:62`), or `SerializerContextBuilder.php:68` écrase entièrement cette clé avec `$operation->getOutput()`. Les trois variantes testées (`gen_id` à la racine, sous `output`, dans `output: ['class' => …, 'gen_id' => false]`) restent sans effet.

**Conséquence pratique** : pour typer le code sans subir la sérialisation JSON-LD des objets, séparer les deux responsabilités. Le predicter renvoie des `TitrailleSuggestion` — types réels, aucun `mixed` dans le code — et le provider en produit la représentation HTTP. C'est son rôle : le provider décide de la forme de la réponse. Voir `ContentTitrailleSuggestionsProvider::toPayload()`.

## Deux pièges annexes, vérifiés

**`openapi:` n'est jamais validé au runtime.** Les normalizers ne lisent pas cet attribut. La déclaration titraille annonçait un objet `{suggestions: array}` en `application/json` qui n'a jamais existé sur le fil, et rien ne l'a signalé. À relire systématiquement dès qu'on touche la forme de sortie.

**Une opération `Post` répond 201 par défaut, même sans rien créer.** L'endpoint titraille ne crée aucune ressource : il déclare donc `status: 200,` explicitement sur l'opération, comme une trentaine d'autres opérations du repo (`src/Entity/Back/User.php`, `src/Entity/Cms/Taxonomy.php`, `src/Entity/Cms/SnapshotType.php`…). Sans ce `status:`, API Platform renvoie `201 Created` sans header `Location` — trompeur pour le client. Penser à aligner la clé du bloc `openapi: responses[]` sur le statut réellement renvoyé.

## Mocker un service HTTP externe en test fonctionnel

Aucun scénario Behat ne doit appeler un vrai service externe : c'est flaky, lent, non déterministe, et ça couple la CI à un tiers. Le repo utilise partout la même recette :

1. extraire `<Classe>Interface` **dans le même namespace** que l'implémentation (pas de dossier `Contract/`) ;
2. type-hinter l'**interface** chez tous les consommateurs — sans ça, la décoration provoque un `TypeError`, le stub n'étant pas une instance de la classe concrète ;
3. écrire le stub sous `tests/Behat/Stub/…` en implémentant l'interface ;
4. le déclarer dans `config/services_test.yaml` :

```yaml
    App\Tests\Behat\Stub\Ai\TitraillePredicter:
        decorates: App\Ai\TitraillePredicter
```

Aucun alias n'est à ajouter dans `config/services.yaml` : Symfony auto-alias une interface implémentée par une seule classe chargée via `App\: resource: '../src/'`.

Les 4 stubs existants (`ProductContentFetcher`, `MetadataFetcher`, `PressDispatchFetcher`, `TitraillePredicter`) varient uniquement **selon les arguments de la méthode** (`$type`, `$url`, `$sourceProduct`). Aucun n'est configurable par scénario Gherkin ; ne pas introduire ce pattern sans raison forte.

## La leçon de test

Le décalage a survécu parce que les deux tests unitaires existants assertaient la valeur **avant sérialisation**, sur une fixture dont la clé était inventée :

```php
// Ne prouve RIEN sur ce que le client reçoit — et « proposition_1 » n'a jamais existé
// dans le contrat du micro-service.
self::assertSame([['proposition_1' => 'Suggestion']], $result);
```

Deux leçons distinctes :

**Un test unitaire sur un provider ne dit rien du format sur le fil.** Dès qu'une opération expose une forme JSON à un client, il faut un scénario Behat qui assert le JSON réellement sérialisé — c'est le seul niveau qui traverse les normalizers. Voir `features/cms/content/content_titraille_suggestions.feature`.

**Une fixture au nom inventé se fait passer pour le contrat.** Parce que l'endpoint est un passe-plat, n'importe quelle clé traverse : le test passait au vert tout en documentant un champ fictif. Les échantillons vivent désormais dans `tests/Ai/TitrailleSuggestionSamples.php`, source unique consommée par les deux tests unitaires **et** par le stub Behat, avec les vrais noms de champs (`titre`, `type`, `proposition`) et une histoire métier cohérente de bout en bout. Une évolution du contrat externe ne se corrige qu'à un seul endroit.

## Politique titraille

L'endpoint `POST /contents/{id}/titraille/{type}` est un **passe-plat assumé** : les suggestions du micro-service externe sont relayées telles quelles, sans renommage ni mapping de champ. Le contrat interne des suggestions appartient au micro-service, pas à PIC — le champ `proposition` a déjà changé de nature (texte, puis rang entier) sans préavis. Ne rien figer côté PIC.
