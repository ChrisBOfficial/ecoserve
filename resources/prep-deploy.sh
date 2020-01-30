#!/bin/bash
cd ../ && cp src/server.js ./ && cp src/assets/projects.json ./ && 
zip -r iesat.zip dist/ server.js package.json .env projects.json && 
rm server.js && rm projects.json
