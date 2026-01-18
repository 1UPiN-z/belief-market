#!/bin/bash
# Belief Market - Local Launch Script
# Run this on your LOCAL machine (Mac/Linux/WSL)

echo "🚀 BELIEF MARKET - LOCAL DEPLOYMENT"
echo "===================================="

# Step 1: Build Smart Contract
echo ""
echo "📦 Step 1: Building smart contract..."
anchor build
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo "❌ Build failed. Check Anchor.toml and src/lib.rs"
    exit 1
fi

echo "✅ Build successful!"

# Step 2: Deploy to Devnet
echo ""
echo "🌐 Step 2: Deploying to Solana devnet..."
anchor deploy --provider.cluster devnet
DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -ne 0 ]; then
    echo "❌ Deployment failed. Make sure you have SOL on devnet:"
    echo "   solana airdrop 2 --url devnet"
    exit 1
fi

# Step 3: Extract Program ID
echo ""
echo "✅ Deployment successful!"
PROGRAM_ID=$(solana address -k ~/.config/solana/id.json 2>/dev/null || echo "PROGRAM_ID_NOT_FOUND")
echo "📋 Program ID: $PROGRAM_ID"

# Step 4: Setup Frontend
echo ""
echo "📱 Step 3: Setting up frontend..."
cd frontend
npm install

# Step 5: Configure Environment
echo ""
echo "⚙️  Step 4: Configuring environment..."
echo "REACT_APP_PROGRAM_ID=$PROGRAM_ID" > .env
echo "REACT_APP_NETWORK=devnet" >> .env
echo "REACT_APP_RPC_URL=https://api.devnet.solana.com" >> .env

# Step 6: Copy IDL
echo "📄 Copying IDL file..."
mkdir -p src/idl
cp ../target/idl/belief_market.json src/idl/ 2>/dev/null || echo "⚠️  IDL file not found, may need manual copy"

# Step 7: Start Frontend
echo ""
echo "🎉 READY TO LAUNCH!"
echo ""
echo "Starting frontend..."
npm start

