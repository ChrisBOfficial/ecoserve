#!/bin/bash
cd ../ && cp src/server.js ./ && zip -r iesat.zip dist/ server.js package.json .env && rm server.js
