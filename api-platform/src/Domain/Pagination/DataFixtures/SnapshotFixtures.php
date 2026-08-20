<?php

declare(strict_types=1);

namespace App\Domain\Pagination\DataFixtures;

use App\Domain\Pagination\Entity\Snapshot;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

final class SnapshotFixtures extends Fixture implements FixtureGroupInterface
{
    public static function getGroups(): array
    {
        return ['pagination'];
    }

    public function load(ObjectManager $manager): void
    {
        for ($position = 1; $position <= 60; ++$position) {
            $manager->persist(new Snapshot($position, \sprintf('Snapshot #%02d', $position)));
        }

        $manager->flush();
    }
}
