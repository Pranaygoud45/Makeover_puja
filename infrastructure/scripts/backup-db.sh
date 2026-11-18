#!/usr/bin/env sh
set -eu
: "${DATABASE_URL:?DATABASE_URL must be set}"
: "${BACKUP_DIR:=./backups}"
mkdir -p "$BACKUP_DIR"
pg_dump "$DATABASE_URL" --format=custom --file="$BACKUP_DIR/beauty-$(date +%Y%m%d-%H%M%S).dump"
