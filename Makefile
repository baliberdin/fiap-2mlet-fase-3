VERSION=0.0.1

build-book-store:
	@docker build -t book-store ./book-store

build-recommendation-api:
	@docker build -t recommendation-api ./recommendation-api

stop-all:
	@docker compose down

run-all: stop-all build-book-store build-recommendation-api
	@docker compose up -d
	
run-mysql-client:
	@docker exec -it mysql mysql -u book_store -p

restart-recommendation-api: build-recommendation-api
	@docker compose restart recommendation-api

restart-book-store: build-book-store
	@docker compose restart book-store
	