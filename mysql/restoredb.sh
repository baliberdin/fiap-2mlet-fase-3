#!/bin/bash

mysql -u root --password=$1 < /tmp/db_backup.sql