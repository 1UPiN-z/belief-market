# 🚀 Belief Market - Deployment Instructions

## ✅ What You Already Have (In This Repo)

```
belief-market/
├── programs/belief-market/        # Smart Contract (Rust/Anchor)
│   └── src/                        # 13 instructions, 3 state structs
├── frontend/                       # React App (TypeScript)
│   └── src/                        # 5 pages, components
├── client/                         # TypeScript SDK
│   └── src/                        # SDK to interact with contract
├── tests/                          # 13 test cases
└── [docs and config files]
```

**Status**: ✅ 100% Complete. Nothing is missing.

---

## 🎯 To Launch This Platform

### Step 1: Copy Project to Your Local Machine

```bash
# From your local machine (Mac/Linux/WSL)
# Option A: If using git
git clone <your-repo-url> belief-market
cd belief-market

# Option B: If downloading as zip
# Unzip and navigate to the folder
cd belief-market
```

### Step 2: Prerequisites Check

Make sure you have installed:

```bash
# Check Node.js
node --version  # Should be 18+

# Check Rust
rustc --version

# Install Solana CLI if missing
# https://docs.solana.com/cli/install-solana-cli-tools

# Install Anchor if missing  
npm install -g @coral-xyz/anchor-cli
```

### Step 3: Deploy Smart Contract

```bash
# Navigate to project root
cd belief-market

# Build the contract
anchor build

# Deploy to Solana devnet
anchor deploy --provider.cluster devnet
```

**IMPORTANT**: Save the **Program ID** from the output!

Example output:
```
Program deployed successfully!
Program ID: 11111111111111111111111111111111
```

### Step 4: Setup Frontend Environment

```bash
cd frontend

# Create .env file with your Program ID
echo "REACT_APP_PROGRAM_ID=11111111111111111111111111111111" > .env
echo "REACT_APP_NETWORK=devnet" >> .env
echo "REACT_APP_RPC_URL=https://api.devnet.solana.com" >> .env
```

Replace `11111111111111111111111111111111` with your actual Program ID!

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
```

This will read `package.json` and install everything needed.

### Step 6: Start Frontend

```bash
npm start
```

This opens: **http://localhost:3000**

---

## 🎮 Using The App

1. **Connect Wallet**: Click "Connect Wallet" → Select Phantom
2. **Grant Permission**: Approve in Phantom browser extension
3. **Browse Markets**: View available prediction markets
4. **Create Market**: Click "Create Market" to start a new market
5. **Trade**: Buy/sell outcome shares
6. **Portfolio**: Track your positions
7. **Settings**: Configure preferences

---

## 🔧 Troubleshooting

### "No SOL on Devnet"
```bash
solana airdrop 2 --url devnet
```

### "Can't find Anchor"
```bash
cargo install --git https://github.com/coral-xyz/anchor anchor-cli
```

### "npm start fails"
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### "Phantom wallet not connecting"
- Make sure Phantom is installed in your browser
- Make sure devnet is selected in Phantom
- Refresh the page after connecting wallet

### "Program ID error in browser console"
- Verify `.env` has correct REACT_APP_PROGRAM_ID
- Run `npm start` again
- Hard refresh browser (Ctrl+Shift+R)

---

## 📊 Project Structure

```
Smart Contract (Rust/Anchor)
├── Instructions
│   ├── initialize_global         # Setup global state
│   ├── create_market             # Create prediction market
│   ├── buy_outcome               # Buy outcome shares
│   ├── sell_outcome              # Sell outcome shares
│   ├── resolve_market            # Resolve market
│   ├── redeem_winnings           # Claim winnings
│   └── ... (7 more)
├── State
│   ├── GlobalState               # Platform state
│   ├── Market                    # Market data
│   └── UserProfile               # User data
└── Parimutuel Pooling            # Odds calculation

Frontend (React)
├── Pages
│   ├── Home                      # Market listing
│   ├── MarketDetail              # Trading interface
│   ├── Portfolio                 # Position tracking
│   └── Settings                  # User preferences
├── Components
│   └── Header                    # Navigation + wallet
└── Styling
    └── Tailwind CSS              # Dark theme

SDK (TypeScript)
├── BelievMarketSDK               # Main SDK class
├── Instructions                  # Instruction methods
└── Types                         # TypeScript types
```

---

## 🚀 Production Deployment

When ready to go mainnet:

```bash
# Change devnet to mainnet-beta
anchor deploy --provider.cluster mainnet-beta

# Update frontend .env
REACT_APP_NETWORK=mainnet-beta
REACT_APP_RPC_URL=https://api.mainnet-beta.solana.com
```

---

## 📚 Documentation

- **QUICK_START.md** - Quick reference
- **README.md** - Full project overview
- **SETUP_GUIDE.md** - Detailed setup
- **INTEGRATION_EXAMPLES.ts** - Code examples
- **DEPLOYMENT_INSTRUCTIONS.md** - Full deploy guide

---

## ✨ You're All Set!

Your prediction market platform is complete and ready to launch. 

**Next steps:**
1. Copy project to local machine
2. Deploy smart contract (`anchor deploy`)
3. Add Program ID to frontend
4. Run frontend (`npm start`)
5. Connect Phantom wallet
6. Start creating markets!

Good luck! 🎯

