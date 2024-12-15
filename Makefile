VERSION=0.0.1
DBPASS="$(shell docker logs mysql 2>/dev/null | grep "GENERATED ROOT PASSWORD" | cut -d' ' -f8)"

build-book-store:
	@docker build -t book-store ./book-store

stop-book-store:
	@docker compose down book-store

start-book-store:
	@docker compose up -d book-store

restart-book-store: stop-book-store build-book-store start-book-store

build-recommendation-api:
	@docker build -t recommendation-api ./recommendation-api

stop-recommendation-api:
	@docker compose down recommendation-api

start-recommendation-api:
	@docker compose up -d recommendation-api

restart-recommendation-api: stop-recommendation-api build-recommendation-api start-recommendation-api

stop-all:
	@docker compose down

run-all: stop-all build-book-store build-recommendation-api
	@docker compose up -d
	
run-mysql-client:
	@docker exec -it mysql mysql -u book_store --password="1234"

restart-book-store: build-book-store
	@docker compose restart book-store
	
run-model-generation-notebook:
	@jupyter nbconvert --to notebook --execute notebooks/books-recommendation-db.ipynb --output=_books-recommendation-db.ipynb

restore-db:
	@docker cp ./mysql/db_backup.sql mysql:/tmp/db_backup.sql
	@docker cp ./mysql/restoredb.sh mysql:/tmp/restoredb.sh
	@docker exec mysql /tmp/restoredb.sh ${DBPASS}

mysql-dump:
	@docker cp ./mysql/dump.sh mysql:/tmp/dump.sh
	@docker exec -t mysql /tmp/dump.sh ${DBPASS}
	@docker cp mysql:/tmp/db_backup.sql ./mysql/db_backup.sql
	@echo -e "CREATE DATABASE IF NOT EXISTS book_store; \nUSE book_store;" | cat - ./mysql/db_backup.sql > ./mysql/.db_backup.sql.tmp
	@mv ./mysql/.db_backup.sql.tmp ./mysql/db_backup.sql  

stop-mysql:
	@docker compose down mysql

start-mysql:
	@docker compose up -d mysql
	@echo "Waiting to database to be ready"
	@until `ncat -zv localhost 3306 1>/dev/null 2>/dev/null`; do echo -n "."; sleep 2; done
	@until `docker exec  mysql mysql -u book_store --password=1234  1>/dev/null 2>/dev/null`; do echo -n "."; sleep 2; done
	@echo "MySQL Done."

recreate-db: stop-mysql start-mysql restore-db