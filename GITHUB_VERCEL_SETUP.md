# 🚀 WAGMI - GitHub & Vercel Deployment Guide

## ✅ STEP 1: CREATE GITHUB REPOSITORY

You need to create the repo first on GitHub, then push from here.

### Option A: GitHub Web UI (Easiest)

1. Go to: **https://github.com/new**
2. Fill in:
   - Repository name: `wagmi`
   - Description: "WAGMI: We're All Gonna Make It - Decentralized Prediction Markets on Solana"
   - Choose: **Public**
   - ⚠️ DO NOT initialize with README (we already have one)
3. Click **"Create repository"**
4. You'll see setup instructions - **follow Step 3 below**

### Option B: GitHub CLI (If Auth Works)

```bash
gh repo create wagmi --public --source=. --remote=origin --push
```

---

## ✅ STEP 2: VERIFY GITHUB SETUP

After creating the repo, run this to confirm:

```bash
cd /workspaces/codespaces-blank/belief-market
git remote -v
```

You should see:
```
origin  https://github.com/talk2mugambi-afk/wagmi.git (fetch)
origin  https://github.com/talk2mugambi-afk/wagmi.git (push)
```

---

## ✅ STEP 3: PUSH YOUR CODE TO GITHUB

Once the repo exists, run:

```bash
cd /workspaces/codespaces-blank/belief-market

git branch -M main
git push -u origin main
```

This pushes all your code to GitHub. Wait for it to complete.

**You should see:**
```
Enumerating objects: XXX, done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## ✅ STEP 4: VERIFY ON GITHUB

Go to: **https://github.com/talk2mugambi-afk/wagmi**

You should see:
- ✅ All files
- ✅ START_HERE.txt
- ✅ README.md
- ✅ frontend/ folder
- ✅ programs/ folder
- ✅ SOLANA_PLAYGROUND.md, DOCKER_DEPLOY.md, etc.

---

## ✅ STEP 5: VERCEL DEPLOYMENT (YOU DO THIS)

Now you deploy to Vercel:

### Via Web UI (Recommended)

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Authorize Vercel to access your GitHub
4. Select **talk2mugambi-afk/wagmi**
5. On the setup screen:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Click **"Environment Variables"** and add:
   ```
   REACT_APP_PROGRAM_ID = <your-program-id>
   REACT_APP_NETWORK = devnet
   REACT_APP_RPC_URL = https://api.devnet.solana.com
   ```
7. Click **"Deploy"**
8. Wait for build to complete
9. Get your live URL! 🎉

### Via Vercel CLI (Alternative)

```bash
npm i -g vercel
vercel login
cd frontend
vercel --prod
```

---

## 📋 YOUR QUICK CHECKLIST

- [ ] Create repo on GitHub (https://github.com/new)
- [ ] Repository name: `wagmi`
- [ ] Make it Public
- [ ] DO NOT add README
- [ ] Run: `git push -u origin main` from codespace
- [ ] Verify at: https://github.com/talk2mugambi-afk/wagmi
- [ ] Go to: https://vercel.com/new
- [ ] Select your repo
- [ ] Set Root Directory to: `frontend`
- [ ] Add environment variables
- [ ] Click Deploy
- [ ] Get your live URL! 🚀

---

## 🎯 AFTER DEPLOYMENT

Once Vercel deploys, you'll get a URL like:
```
https://wagmi-talk2mugambi-afk.vercel.app
```

Share this with anyone to show your live platform!

---

## 📝 Files Already Added for You

✅ `.gitignore` - Prevents committing secrets
✅ `vercel.json` - Tells Vercel how to build
✅ All documentation
✅ Git initialized and ready

---

## ⚠️ IMPORTANT

- **Do NOT commit `.env` files** (already in .gitignore)
- **Do add environment variables in Vercel dashboard** (not in code)
- **Program ID goes in Vercel env vars**, not in GitHub

---

## 🆘 NEED HELP?

If deployment fails:
1. Check Vercel build logs (they show errors)
2. Paste error message in chat
3. I'll help debug

---

## ✨ YOU'RE ALMOST DONE!

1. Create GitHub repo
2. Push code
3. Deploy to Vercel
4. Share your live URL!

**Let me know when the repo is created and I'll verify everything is ready!**

