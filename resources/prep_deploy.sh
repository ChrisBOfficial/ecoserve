#!/bin/bash

cd ../ && zip invasive-species.zip src/CSVReaderCode/ src/app.js src/package-lock.json src/package.json src/www/ -x src/node_modules/\* src/.DS_Store src/www/.DS_Store
