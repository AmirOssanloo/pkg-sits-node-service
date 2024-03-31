#!/bin/bash
export NODE_ENV=production

# Remove the dist directory
rm -rf dist

# Build the project
tsc --project tsconfig.prod.json

# Copy the typings directory to the dist directory
cp -R src/typings dist/typings