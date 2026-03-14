#!/bin/bash

echo "Installing main project dependencies..."
npm install

echo "Installing Sanity Studio dependencies..."
cd sanity-studio && npm install && cd ..

echo "Done! Run 'npm run dev' to start."
