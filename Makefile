.PHONY: up down restart ps logs pull config

up:
\tdocker compose up -d

down:
\tdocker compose down

restart:
\tdocker compose down && docker compose up -d

ps:
\tdocker compose ps

logs:
\tdocker compose logs -f --tail=200

pull:
\tdocker compose pull

config:
\tdocker compose config

