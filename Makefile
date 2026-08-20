.DEFAULT_GOAL := help
DC := docker compose
PHP := $(DC) exec php
CONSOLE := $(PHP) php bin/console
CONSOLE_TEST := $(DC) exec -e APP_ENV=test php php bin/console

.PHONY: help up down dev dev-docker logs shell console composer db db-test test test-front

help: ## List targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

up: ## Start Postgres + API on http://localhost:8000/api
	$(DC) up -d --wait

down: ## Stop everything
	$(DC) --profile front down

dev: up ## API in Docker + Vite on the host (recommended)
	pnpm --dir react dev

dev-docker: ## Everything in Docker, Vite included, on http://localhost:5173
	$(DC) --profile front up -d --wait

logs: ## Tail container logs
	$(DC) logs -f

shell: ## Shell inside the PHP container
	$(PHP) bash

console: ## Run a Symfony command, e.g. make console c="cache:clear"
	$(CONSOLE) $(c)

composer: ## Run Composer, e.g. make composer c="require foo/bar"
	$(PHP) composer $(c)

db: ## Create the schema from scratch (drops it first)
	$(CONSOLE) doctrine:schema:drop --force --full-database
	$(CONSOLE) doctrine:migrations:migrate --no-interaction
	$(CONSOLE) doctrine:fixtures:load --no-interaction

db-test: ## Same, on the test database (required before `make test`)
	$(CONSOLE_TEST) doctrine:database:create --if-not-exists
	$(CONSOLE_TEST) doctrine:migrations:migrate --no-interaction
	$(CONSOLE_TEST) doctrine:fixtures:load --no-interaction

test: ## Backend test suite
	$(DC) exec -e APP_ENV=test php vendor/bin/phpunit

test-front: ## Front test suite
	pnpm --dir react test --run
