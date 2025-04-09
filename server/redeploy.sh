#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting redeploy process...${NC}"

# Fetch and pull the latest changes from Git
echo "Pulling latest changes from Git..."
git fetch && git pull || {
    echo -e "${RED}Error: Git fetch/pull failed${NC}"
    exit 1
}

# Restart the PM2 process with ID/name '2'
echo "Restarting PM2 app...»
pm2 restart 2 || {
    echo -e "${RED}Error: PM2 restart failed${NC}"
    exit 1
}

echo -e "${GREEN}Redeploy completed successfully!${NC}"