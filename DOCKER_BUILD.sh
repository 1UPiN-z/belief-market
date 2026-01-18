#!/bin/bash

# WAGMI - Docker Deployment Script
# This runs everything inside Docker so no local setup needed!

set -e

echo "🚀 WAGMI - Docker Deployment"
echo "============================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

echo "📦 Building Docker image..."
docker-compose build --no-cache wagmi-builder

echo ""
echo "🔨 Starting build process inside Docker..."
echo ""

# Run inside Docker container
docker-compose run --rm wagmi-builder bash -c '
echo "📋 Step 1: Build WAGMI Smart Contract"
cd /workspace

# Configure Solana CLI
solana config set --url https://api.devnet.solana.com

# Build
echo "🔨 Building..."
anchor build

echo ""
echo "✅ Build successful!"
echo ""

# List the generated IDL
echo "📄 Generated IDL:"
ls -lh target/idl/

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to your local machine"
echo "2. cd wagmi/frontend"
echo "3. npm install"
echo "4. npm start"
'

echo ""
echo "✨ Docker build complete!"
echo ""
echo "📁 Your built files are in: target/idl/ and target/deploy/"
