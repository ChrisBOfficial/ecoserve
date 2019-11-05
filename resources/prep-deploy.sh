#!/bin/bash
cd ../ && cp src/server.js ./ && zip -r invasive-species.zip dist/ server.js package.json && rm server.js
