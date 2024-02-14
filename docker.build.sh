#!/bin/bash

docker stop tbell-mm-frontend

docker rm -f tbell-mm-frontend

docker build -t tbell-mm-frontend .

docker run -dp 3000:3000 --name tbell-mm-frontend -v "$(pwd)"/build:/app tbell-mm-frontend:latest