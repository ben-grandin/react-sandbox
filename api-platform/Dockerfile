# syntax=docker/dockerfile:1
FROM dunglas/frankenphp:1-php8.4-bookworm

# The dev container runs as root (the base image sets no USER); Composer refuses to run
# as root without this.
ENV COMPOSER_ALLOW_SUPERUSER=1
# symfony/flex reads $_SERVER['SYMFONY_DOCKER']; "0" makes recipe installs non-interactive
# and stops Flex from injecting its own compose services into this repo's compose.yaml.
ENV SYMFONY_DOCKER=0

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip \
    && rm -rf /var/lib/apt/lists/* \
    && install-php-extensions @composer apcu intl opcache zip pdo_pgsql xdebug
