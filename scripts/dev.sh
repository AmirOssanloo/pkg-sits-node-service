#!/bin/bash

export NODE_ENV=development
nodemon --watch 'src/**/*' --watch 'examples/**/*' -e ts,tsx --exec 'ts-node' ./examples/index.ts