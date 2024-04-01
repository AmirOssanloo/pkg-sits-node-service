#!/bin/bash

export NODE_ENV=production
rm -rf dist
tsc --project tsconfig.prod.json
cp -R src/typings dist/typings