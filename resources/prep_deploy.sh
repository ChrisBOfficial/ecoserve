#!/bin/bash

cd ../ && zip -r invasive-species.zip src/ -x src/node_modules/\* src/.DS_Store src/www/.DS_Store
