#!/bin/bash
# sync_repos.sh
# Script to sync changes from organization repo to personal fork for Vercel deployment
# Author: iNezerr

echo "🔄 Starting synchronization between Hues-Apply/HA_frontend and iNezerr/HA_frontend..."

# Store the current directory
CURRENT_DIR=$(pwd)

# Check if the local repo exists
if [ -d "c:/src/HuesApply/HA_frontend" ]; then
  cd "c:/src/HuesApply/HA_frontend"

  echo "📋 Checking for uncommitted changes in Hues-Apply repo..."
  if [[ $(git status --porcelain) ]]; then
    echo "⚠️ Uncommitted changes detected. Committing them first..."
    git add .
    git commit -m "Auto-commit before sync: $(date)"
    git push
    echo "✅ Changes committed and pushed to Hues-Apply repo."
  else
    echo "✅ No uncommitted changes in Hues-Apply repo."
  fi
  
  # Make sure we have the latest changes
  echo "⬇️ Pulling latest changes from Hues-Apply repo..."
  git pull origin main
  
  # Now let's handle the personal fork
  echo "🔍 Checking if iNezerr fork is configured as a remote..."
  if ! git remote | grep -q "personal"; then
    echo "➕ Adding iNezerr fork as 'personal' remote..."
    git remote add personal https://github.com/iNezerr/HA_frontend.git
  else
    echo "✅ Remote 'personal' already configured."
  fi
  
  # Fetch from personal fork to make sure we're up to date
  echo "⬇️ Fetching from iNezerr fork..."
  git fetch personal
  
  # Push changes to personal fork
  echo "⬆️ Pushing changes to iNezerr fork..."
  git push personal main
  
  echo "🎉 Synchronization complete! Vercel should now start deploying automatically."
  echo "📊 Check deployment status at: https://vercel.com/inezerr/ha-frontend"

  # Return to original directory
  cd "$CURRENT_DIR"
else
  echo "❌ Error: Repository directory not found at c:/src/HuesApply/HA_frontend"
  exit 1
fi
