#!/bin/bash
cd ../ && cp src/server.js ./ && cp src/api/pipelines.js ./ && zip -r ecoserve-app.zip dist/ .ebextensions/ server.js pipelines.js package.json .env && rm server.js pipelines.js
