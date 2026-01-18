# 🚀 Belief Market - Quick Start

## What You Have

✅ Complete smart contract (Rust/Anchor)
✅ TypeScript SDK
✅ React frontend
✅ All dependencies configured
✅ Everything is ready to deploy

## What You Need to Do (On Your Local Machine)

### 1. Prerequisites
```bash
# Install if you don't have:
# - Node.js 18+
# - Solana CLI
# - Anchor CLI
# - Rust

solana --version
anchor --version
```

### 2. Build & Deploy Smart Contract
```bash
cd belief-market
anchor build
anchor deploy --provider.cluster devnet
```

**Save the Program ID from the output!**

### 3. Configure Frontend
```bash
cd frontend
echo "REACT_APP_PROGRAM_ID=<YOUR_PROGRAM_ID>" > .env
echo "REACT_APP_NETWORK=devnet" >> .env
echo "REACT_APP_RPC_URL=https://api.devnet.solana.com" >> .env
```

### 4. Launch Frontend
```bash
npm install
npm start
```

Opens at: **http://localhost:3000**

Connect your Phantom wallet and start trading!

## Files Location

- **Smart Contract**: `programs/belief-market/src/`
- **Frontend**: `frontend/src/`
- **SDK**: `client/src/`
- **Tests**: `tests/belief-market.ts`

## Deploy Script

Run this on your local machine:
```bash
bash LAUNCH_LOCALLY.sh
```

This will:
1. Build smart contract
2. Deploy to devnet
3. Setup frontend
4. Launch app at localhost:3000

## Troubleshooting

**No SOL on devnet?**
```bash
solana airdrop 2 --url devnet
```

**Can't find Program ID?**
```bash
# After deploying, check:
solana program list --url devnet
```

**Frontend won't start?**
```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

## That's It!

Your prediction market platform is ready to launch. 🎯
