#!/bin/bash
cd ../ && cp src/server.js ./ && cp src/api/pipelines.js ./ && zip -r iesat.zip dist/ server.js pipelines.js package.json .env && rm server.js pipelines.js
