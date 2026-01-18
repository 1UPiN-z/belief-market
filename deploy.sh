#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd /workspaces/codespaces-blank/belief-market

echo -e "${BLUE}🚀 Belief Market Deployment Script${NC}"
echo ""

# Setup PATH for Solana
export PATH="/workspaces/codespaces-blank/belief-market/solana-release/bin:$PATH"
source $HOME/.cargo/env

echo -e "${BLUE}📊 Current Status:${NC}"
echo "Wallet: $(solana address)"
echo "Balance: $(solana balance) SOL"
echo "RPC: $(solana config get | grep RPC)"
echo ""

echo -e "${BLUE}🏗️ Building program...${NC}"
cd /workspaces/codespaces-blank/belief-market/programs/belief-market
cargo build-bpf 2>&1 | tail -10
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${YELLOW}⚠️ Build output above${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Deploying to Solana Devnet...${NC}"

# Deploy using solana CLI
cd /workspaces/codespaces-blank/belief-market

# Get the program binary path
PROGRAM_BIN="target/deploy/belief_market.so"

if [ ! -f "$PROGRAM_BIN" ]; then
    echo -e "${YELLOW}Program binary not found at $PROGRAM_BIN${NC}"
    echo "Checking for alternative paths..."
    find . -name "belief_market.so" 2>/dev/null || echo "No .so file found"
    exit 1
fi

echo "Deploying $PROGRAM_BIN"
solana program deploy "$PROGRAM_BIN" --url https://api.devnet.solana.com -k ~/.config/solana/id.json

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "1. Save your Program ID from above"
echo "2. Update PROGRAM_ID in Anchor.toml"
echo "3. Run tests: anchor test"
echo "4. Integrate with frontend"
