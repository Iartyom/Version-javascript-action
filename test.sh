#!/bin/bash

npm test index.test.js | tee index.test.out
npm test monday-api-wrapper.test.js | tee monday-api-wrapper.test.out