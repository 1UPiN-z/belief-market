# 🎮 WAGMI - Solana Playground Deployment

## What is Solana Playground?

**Solana Playground** = Online IDE in your browser where you can:
- Write Solana programs
- Deploy instantly  
- Get Program ID immediately
- No local setup needed
- Works on any browser

**URL:** https://beta.solpg.io/

---

## 🚀 Deploy WAGMI in Solana Playground (5 minutes)

### Step 1: Go to Solana Playground
Open: https://beta.solpg.io/

### Step 2: Create New Project
- Click **"Create"** → **"Create Project"**
- Choose template: **"Anchor"**
- Name it: `wagmi` or `wagmi-market`
- Click **Create**

### Step 3: Upload Your Contract

You have **two options:**

#### **Option A: Manual File Upload (Recommended)**
1. Download the contract files from GitHub to your local machine
2. In Playground, delete the default files
3. Upload your contract files:
   - `programs/belief-market/src/lib.rs`
   - `programs/belief-market/src/instructions/*.rs`
   - `programs/belief-market/src/state/*.rs`
   - `programs/belief-market/src/errors.rs`
   - `programs/belief-market/src/constants.rs`
4. Update `Cargo.toml` in programs/belief-market/

#### **Option B: Clone from GitHub (Faster)**
If Playground supports it:
1. Click **"Import from Github"**
2. Paste your GitHub repo URL
3. Playground will auto-load everything

### Step 4: Build the Program
1. In Playground, click **Build**
2. Wait for compilation (should take ~2-3 minutes)
3. Look for: **"Build successful!"**

### Step 5: Deploy
1. Click **Deploy**
2. Playground will:
   - Request wallet connection (use Phantom)
   - Create a keypair
   - Deploy to devnet
   - Show you the **Program ID**

### Step 6: Copy Program ID
The Playground shows your **Program ID** on the right side. It looks like:
```
Program ID: 11111111111111111111111111111111
```

**Copy this!**

---

## 📋 Step-by-Step Visual Guide

```
Solana Playground (https://beta.solpg.io/)
    ↓
Create New Anchor Project
    ↓
Upload/Paste Your Contract Code
    ↓
Click "Build"
    ↓
See "Build successful!"
    ↓
Click "Deploy"
    ↓
Approve in Phantom Wallet
    ↓
Get Program ID ✅
```

---

## 🎯 What You'll Get

After deployment, you'll see something like:

```
Program ID: 2cYHB7EhHn7G4HrGmwBkwjgbpTQNe3Gzz9xjw8qJeWvC
```

This is your **PROGRAM_ID** for the frontend!

---

## 🔑 Using the Program ID

Once you have it:

```bash
cd frontend
echo "REACT_APP_PROGRAM_ID=2cYHB7EhHn7G4HrGmwBkwjgbpTQNe3Gzz9xjw8qJeWvC" > .env
echo "REACT_APP_NETWORK=devnet" >> .env
echo "REACT_APP_RPC_URL=https://api.devnet.solana.com" >> .env

npm install
npm start
```

Now your frontend can talk to your deployed contract! ✅

---

## 📦 What Files to Upload to Playground

At minimum, upload these files from your project:

```
programs/belief-market/
├── src/
│   ├── lib.rs              ← Main file
│   ├── instructions/       ← All instruction files
│   ├── state/              ← All state files
│   ├── errors.rs           ← Error definitions
│   └── constants.rs        ← Constants
└── Cargo.toml              ← Dependencies
```

---

## ✨ Advantages of Solana Playground

✅ **No installation needed**
✅ **Deploy in browser**
✅ **Instant Program ID**
✅ **See build logs**
✅ **Test immediately**
✅ **Share code with others**
✅ **Works on any device**

---

## 🆘 Troubleshooting

### "Build failed"
- Check your Rust syntax
- Make sure all imports are correct
- Check `Cargo.toml` dependencies

### "Deployment failed"
- Make sure Phantom is installed
- Select devnet in Phantom
- Have SOL in your wallet (use airdrop)

### "Can't see Program ID"
- Look at the deployment output on the right panel
- It should show: `Program ID: ...`
- Scroll if needed

### "Wallet not connecting"
- Install Phantom: https://phantom.app
- Make sure browser extension is enabled
- Refresh the page

---

## 🎮 Complete Workflow

1. **Open Playground**: https://beta.solpg.io/
2. **Create Project**: Choose Anchor template
3. **Upload Code**: Add your contract files
4. **Build**: Click Build → wait 2-3 min
5. **Deploy**: Click Deploy → approve in Phantom
6. **Get ID**: Copy Program ID from output
7. **Configure Frontend**: Add ID to `.env`
8. **Launch**: `npm start`

---

## 📱 Mobile/Alternative Options

If Playground doesn't work:

- **Anchor CLI locally** (via Docker recommended)
- **GitHub Codespaces** (like this one)
- **VS Code with Anchor extension**

But **Playground is easiest** for just getting a Program ID!

---

## 🎉 You Now Have Multiple Paths

### Path 1: Solana Playground ⭐ EASIEST
→ Get Program ID in 5 minutes

### Path 2: Docker (Recommended for Production)
→ Build everything locally without setup

### Path 3: GitHub
→ Push code for others to use

---

## 🔗 Useful Links

- **Solana Playground**: https://beta.solpg.io/
- **Phantom Wallet**: https://phantom.app
- **Solana Docs**: https://docs.solana.com
- **Anchor Docs**: https://www.anchor-lang.com

---

## ✅ Summary

**Fastest way to get Program ID:**

1. Go to https://beta.solpg.io/
2. Create Anchor project
3. Upload your contract files
4. Click Build
5. Click Deploy
6. Copy Program ID
7. Add to frontend `.env`
8. Done! 🚀

---

This is the **simplest, fastest path** to launch WAGMI!

