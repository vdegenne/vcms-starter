#!/bin/bash

# crontab example
# crontab -e
# 50 23 * * * /home/user/project/sql/backups/backup-database.sh
# to execute this script everyday at 23:50

dirname="$(cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd)"
date="$(date +'%Y-%m-%d_%H:%M')"
filepath="$dirname/${date}__%dbname%.backup"

# cd $dirname

pg_dump -Fc %dbname% > $filepath

gzip $filepath

# we can then use
# pg_restore -Fc -U postgres -d %dbname% backupFile.backup
