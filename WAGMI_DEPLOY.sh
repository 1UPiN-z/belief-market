#!/bin/bash

# WAGMI - We're All Gonna Make It
# Deployment Script for Local Machine

echo "🚀 WAGMI DEPLOYMENT"
echo "===================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not installed"; exit 1; }
command -v rustc >/dev/null 2>&1 || { echo "❌ Rust not installed"; exit 1; }
command -v anchor >/dev/null 2>&1 || { echo "❌ Anchor CLI not installed"; exit 1; }
echo "✅ All prerequisites installed"

# Step 1: Build Smart Contract
echo ""
echo "📦 Step 1/5: Building smart contract..."
anchor build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"

# Step 2: Deploy to Devnet
echo ""
echo "🌐 Step 2/5: Deploying to Solana devnet..."
echo "💡 Make sure you have SOL: solana airdrop 2 --url devnet"
anchor deploy --provider.cluster devnet
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi
echo "✅ Deployment successful"

# Step 3: Get Program ID
echo ""
echo "📋 Step 3/5: Getting Program ID..."
PROGRAM_ID=$(solana address -k ~/.config/solana/id.json 2>/dev/null)
if [ -z "$PROGRAM_ID" ]; then
    echo "⚠️  Could not extract Program ID automatically"
    echo "📋 Please check your deployment output above for the Program ID"
    echo "💾 Save it now - you'll need it in the next step"
    read -p "Enter your Program ID: " PROGRAM_ID
fi
echo "✅ Program ID: $PROGRAM_ID"

# Step 4: Setup Frontend
echo ""
echo "📱 Step 4/5: Setting up frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"

# Step 5: Configure Environment
echo ""
echo "⚙️  Step 5/5: Configuring environment..."
cat > .env << ENVEOF
REACT_APP_PROGRAM_ID=$PROGRAM_ID
REACT_APP_NETWORK=devnet
REACT_APP_RPC_URL=https://api.devnet.solana.com
ENVEOF
echo "✅ Environment configured"

# Done
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "   Program ID: $PROGRAM_ID"
echo ""
echo "Starting WAGMI frontend..."
npm start

