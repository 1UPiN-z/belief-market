# 🚀 WAGMI Deployment Guide

**WAGMI** = We're All Gonna Make It

Your complete decentralized prediction market platform, fully customized with the WAGMI branding.

## 📊 Project Size

Total: **1.2GB** (includes Solana CLI binaries)
Project code: **~200KB** (very manageable!)

## 🎯 One-Command Deployment

On your **local machine**, run:

```bash
bash WAGMI_DEPLOY.sh
```

This script does everything:
1. ✅ Checks prerequisites (Node, Rust, Anchor)
2. ✅ Builds smart contract
3. ✅ Deploys to Solana devnet
4. ✅ Extracts Program ID
5. ✅ Installs frontend dependencies
6. ✅ Configures environment
7. ✅ Launches frontend

**That's it!** Your WAGMI platform will be live at `http://localhost:3000`

## 📋 Prerequisites

Make sure you have on your local machine:

```bash
# Check these
node --version        # Should be 18+
rustc --version       # Latest
anchor --version      # Latest
solana --version      # Latest
```

**Missing something?**

```bash
# Node.js: https://nodejs.org
# Rust: https://rustup.rs
# Anchor: npm install -g @coral-xyz/anchor-cli
# Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
```

## 🤝 Manual Deployment (Step by Step)

If you prefer to deploy manually:

```bash
# 1. Build contract
anchor build

# 2. Deploy to devnet
anchor deploy --provider.cluster devnet

# 3. Save the Program ID from output

# 4. Configure frontend
cd frontend
echo "REACT_APP_PROGRAM_ID=<YOUR_ID>" > .env
echo "REACT_APP_NETWORK=devnet" >> .env
echo "REACT_APP_RPC_URL=https://api.devnet.solana.com" >> .env

# 5. Launch
npm install
npm start
```

Opens at: **http://localhost:3000**

## ⚡ Quick Troubleshooting

**"No SOL on devnet"**
```bash
solana airdrop 2 --url devnet
```

**"npm install fails"**
```bash
npm install --legacy-peer-deps
```

**"Phantom wallet not connecting"**
- Ensure Phantom is installed in your browser
- Make sure devnet is selected in Phantom settings
- Refresh the page

**"Program ID error in console"**
- Verify `.env` has the correct Program ID
- Restart frontend: `npm start`
- Hard refresh browser: `Ctrl+Shift+R`

## 🎮 Features in WAGMI

**Trading:**
- Create prediction markets
- Buy/sell outcome shares
- Real-time odds calculation
- Multiple wallet support (Phantom, Solflare, Torus)

**Portfolio:**
- Track all your positions
- View P&L in real-time
- Monitor market status

**Earnings:**
- 80% goes to platform
- 10% to market creator
- 10% to referrer (if referred)

## 📱 Frontend Customization

The WAGMI branding is integrated throughout:
- **Logo**: Green gradient with 🚀 emoji
- **Title**: "WAGMI Markets" with subtitle
- **Footer**: "WAGMI - We're All Gonna Make It"
- **Colors**: Green/Emerald theme (prosperity/growth vibes)

**Want to change it?**
- Logo: `frontend/src/components/Header.tsx` (line 31)
- Title: `frontend/src/pages/Home.tsx` (line 64)
- Colors: `frontend/src/App.css` (modify Tailwind classes)
- Footer: `frontend/src/App.tsx` (line 62)

## 🌐 Production Deployment

When ready to go mainnet:

```bash
# Change devnet to mainnet-beta
anchor deploy --provider.cluster mainnet-beta

# Update frontend
echo "REACT_APP_PROGRAM_ID=<YOUR_MAINNET_ID>" > frontend/.env
echo "REACT_APP_NETWORK=mainnet-beta" >> frontend/.env
echo "REACT_APP_RPC_URL=https://api.mainnet-beta.solana.com" >> frontend/.env

# Redeploy frontend to Vercel/Netlify
npm run build
```

## 📚 Documentation

All documentation is included:

- **README.md** - Full project overview
- **START_HERE.txt** - Quick start
- **QUICK_START.md** - Command reference
- **INTEGRATION_EXAMPLES.ts** - Code examples

## ✨ You're Ready!

Your WAGMI platform is complete and ready to deploy.

**Next step:** Run `bash WAGMI_DEPLOY.sh` on your local machine

Good luck! 🚀

**We're All Gonna Make It** 💚
