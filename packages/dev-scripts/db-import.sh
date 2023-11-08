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

if [ -n "$1" ]; then
  SQL_FILE="$1"
else
  SQL_FILE=$(ls -t ./shared/dumps/*.sql | head -1)
fi

if [ ! -f "$SQL_FILE" ]; then
  echo -e "Error: SQL file '$SQL_FILE' not found. Please make sure the file exists."
  exit 1
fi

docker exec -i "$DATABASE_DOCKER_CONTAINER_NAME"_database sh -c 'exec mysql -u "$DATABASE_USERNAME" -p"$DATABASE_PASSWORD" "$DATABASE_NAME"' < "$SQL_FILE"

if [ $? -eq 0 ]; then
  echo -e "SQL file '$SQL_FILE' imported successfully into the '$DATABASE_NAME' database."
else
  echo -e "Error: Failed to import SQL file '$SQL_FILE' into the '$DATABASE_NAME' database."
fi
