#!/bin/bash

echo "Starting redeploy process..."

# Fetch and pull the latest changes from Git
echo "Pulling latest changes from Git..."
git fetch && git pull || {
    echo "Error: Git fetch/pull failed"
    exit 1
}

# Restart the PM2 process with ID/name '2'
echo "Restarting PM2 app..."
pm2 restart 2 || {
    echo "Error: PM2 restart failed"
    exit 1
}

echo "Redeploy completed successfully!"
