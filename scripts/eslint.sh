#!/bin/bash

echo "👀 Checking linter..."
eslint ./src/**/* --ext .ts --ext .tsx --ext .js --ext .jsx
