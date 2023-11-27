all: down build up

down:
	docker compose down

build:
	docker compose build

up:
	docker compose up -d

app:
	docker compose exec -it app bash

server:
	node src/index.mjs
