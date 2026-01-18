# 🚀 WAGMI - GitHub Deployment Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web UI (Easiest)

1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name**: `wagmi` (or `wagmi-market`)
   - **Description**: "WAGMI: We're All Gonna Make It - Decentralized Prediction Markets on Solana"
   - **Public** (so others can see it)
   - **Add a README** ✅ (optional, we have one)
3. Click "Create repository"
4. **Copy the repository URL** (something like: `https://github.com/YOUR-USERNAME/wagmi.git`)

### Option B: Using GitHub CLI

```bash
gh repo create wagmi --public --source=. --remote=origin --push
```

---

## Step 2: Connect Local Repo to GitHub

```bash
cd /path/to/belief-market

# Add GitHub as remote
git remote add origin https://github.com/YOUR-USERNAME/wagmi.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Step 3: Verify on GitHub

Go to your repo URL and verify:
- ✅ All files are there
- ✅ `START_HERE.txt` is visible
- ✅ `README.md` is showing
- ✅ All documentation is readable

---

## Step 4: Share & Deploy Locally

Now you have the project on GitHub!

### For You (Local Deployment):

```bash
# Clone if you want a clean copy
git clone https://github.com/YOUR-USERNAME/wagmi.git
cd wagmi

# Deploy smart contract
anchor build
anchor deploy --provider.cluster devnet

# Configure frontend with Program ID
cd frontend
echo "REACT_APP_PROGRAM_ID=<YOUR_PROGRAM_ID>" > .env
echo "REACT_APP_NETWORK=devnet" >> .env
echo "REACT_APP_RPC_URL=https://api.devnet.solana.com" >> .env

# Launch
npm install
npm start
```

### For Others (If You Share):

```bash
git clone https://github.com/YOUR-USERNAME/wagmi.git
cd wagmi

# Read the setup guide
cat START_HERE.txt

# Or open README_DEPLOY.md for step-by-step instructions
```

---

## Step 5: Make Updates & Push

After you deploy and test:

```bash
# Make changes
# Edit files...

# Stage changes
git add .

# Commit
git commit -m "Update description or bug fixes"

# Push to GitHub
git push
```

---

## What to Do Next

1. ✅ Create GitHub repo (use link above)
2. ✅ Copy repository URL
3. ✅ Run Step 2 commands in terminal
4. ✅ Verify on GitHub
5. ✅ Deploy locally (follow Step 4)

---

## Quick Commands Cheat Sheet

```bash
# Create repo and push everything
git remote add origin https://github.com/YOUR-USERNAME/wagmi.git
git branch -M main
git push -u origin main

# After making changes
git add .
git commit -m "Description of changes"
git push

# Check status
git status
git log --oneline
```

---

## Need Help?

- **GitHub Docs**: https://docs.github.com/en/get-started
- **Git Cheat Sheet**: https://github.github.com/training-kit/
- **SSH Keys**: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Important Notes

⚠️ **Do NOT commit these to GitHub:**
- `.env` files (they have secrets!)
- `node_modules/` (use `.gitignore`)
- Build artifacts (`target/`, `dist/`)

✅ **DO commit:**
- Source code (`.rs`, `.tsx`, `.ts`)
- Configuration (`Anchor.toml`, `package.json`, `tsconfig.json`)
- Documentation (`.md` files)
- Tests

---

You're ready to go! 🎯

