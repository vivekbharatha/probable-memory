#!/bin/bash

docker run \
    -it \
    --rm \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 5000:5000 \
    probable-memory/server:latest