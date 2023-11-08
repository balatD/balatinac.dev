#!/bin/bash

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo -e "Error: $ENV_FILE not found. Please make sure the file exists in the current directory."
  exit 1
fi

source "$ENV_FILE"

if [ -z "$DATABASE_NAME" ] || [ -z "$DATABASE_USERNAME" ] || [ -z "$DATABASE_PASSWORD" ] || [ -z "$DATABASE_DOCKER_CONTAINER_NAME" ]; then
  echo -e "Error: The .env file is missing one or more required variables. Please check the file."
  exit 1
fi

export DATABASE_NAME
export DATABASE_USERNAME
export DATABASE_PASSWORD
export DATABASE_DOCKER_CONTAINER_NAME

TIMESTAMP=$(date +"%Y%m%d%H%M%S")
DUMP_FILENAME="${DATABASE_NAME}_${TIMESTAMP}"
EXPORT_FOLDER="./shared/dumps"

mkdir -p "$EXPORT_FOLDER"

docker exec "$DATABASE_DOCKER_CONTAINER_NAME"_database mariadb-dump -u"$DATABASE_USERNAME" -p"$DATABASE_PASSWORD" "$DATABASE_NAME" > "$EXPORT_FOLDER/$DUMP_FILENAME.sql"

if [ $? -eq 0 ]; then
  echo -e "Table '$DUMP_FILENAME' exported successfully to '$EXPORT_FOLDER/$DUMP_FILENAME.sql'"
else
  echo -e "Error: Failed to export table '$DUMP_FILENAME'"
fi
