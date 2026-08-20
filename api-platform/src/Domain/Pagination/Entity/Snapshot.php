<?php

declare(strict_types=1);

namespace App\Domain\Pagination\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'pagination_snapshot')]
#[ApiResource(
    shortName: 'PaginationSnapshot',
    operations: [
        new GetCollection(
            uriTemplate: '/pagination/snapshots{._format}',
            paginationItemsPerPage: 5,
            paginationClientItemsPerPage: true,
        ),
        new Get(uriTemplate: '/pagination/snapshots/{id}{._format}'),
    ],
)]
class Snapshot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    public function __construct(
        #[ORM\Column]
        public int $position = 0,
        #[ORM\Column(length: 120)]
        public string $label = '',
        #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
        public \DateTimeImmutable $createdAt = new \DateTimeImmutable(),
    ) {
    }
}
