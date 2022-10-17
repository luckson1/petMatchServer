ifneq (,$(wildcard ./.env))
	include .env
	export
	ENV_FILE_PARAM = --env-file .env
endif

build:
	docker-compose up --build --remove-orphans -d

up:
	docker-compose up -d

down:
	docker-compose down

down-V:
	docker-compose down -v

# volume:
# 	docker volume inspect mern-library-nginx_mongodb-data