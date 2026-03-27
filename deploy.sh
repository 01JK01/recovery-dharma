#!/bin/bash
# Recovery Dharma — one-command update deploy
# Usage: ./deploy.sh [path/to/new-App.jsx]
set -e

# Token loaded from .env.local (never committed)
if [ -f .env.local ]; then
  export $(cat .env.local | xargs)
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: Set GITHUB_TOKEN in .env.local"
  exit 1
fi

if [ -n "$1" ]; then
  echo "Copying new version..."
  cp "$1" src/App.jsx
fi

echo "Building..."
npm run build

echo "Pushing to GitHub..."
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/01JK01/recovery-dharma.git"
git add -A
git commit -m "Recovery Dharma update $(date +%Y-%m-%d)" 2>/dev/null || echo "Nothing new to commit"
git push -u origin main

echo ""
echo "LIVE in ~90s: https://recovery-dharma.vercel.app"
