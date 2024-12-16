#!/bin/bash

mysqldump -u root --password=$1 --add-drop-database=TRUE book_store > /tmp/db_backup.sql