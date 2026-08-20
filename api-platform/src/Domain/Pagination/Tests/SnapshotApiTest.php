<?php

declare(strict_types=1);

namespace App\Domain\Pagination\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Domain\Pagination\Entity\Snapshot;

final class SnapshotApiTest extends ApiTestCase
{
    // Pinned explicitly: 4.3 emits a deprecation otherwise, and 5.0 flips the default.
    protected static ?bool $alwaysBootKernel = true;

    public function testCollectionIsPaginatedWithHydraView(): void
    {
        $response = static::createClient()->request('GET', '/api/pagination/snapshots?page=2&itemsPerPage=5', [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            '@type' => 'Collection',
            'totalItems' => 60,
            'view' => [
                '@type' => 'PartialCollectionView',
                'next' => '/api/pagination/snapshots?itemsPerPage=5&page=3',
            ],
        ]);
        self::assertCount(5, $response->toArray()['member']);
        self::assertMatchesResourceCollectionJsonSchema(Snapshot::class);
    }
}
