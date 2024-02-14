#!/bin/bash

docker build -t tbell-mm-frontend .

docker run -dp 3000:3000 --name tbell-mm-frontend tbell-mm-frontend:latest