# 🚀 WAGMI - GitHub & Vercel Deployment (From Local Machine)

## ✅ Status

✅ Repository created: https://github.com/talk2mugambi-afk/wagmi  
⏳ Code ready to push (from your local machine)
⏳ Vercel deployment (next step)

---

## 🎯 YOU ARE HERE: Local Machine Setup

Since the Codespace has limited GitHub permissions, you need to complete this on your local machine.

---

## 📥 STEP 1: Clone/Download the Project Locally

### Option A: Clone from GitHub (Fastest)

```bash
git clone https://github.com/talk2mugambi-afk/wagmi.git
cd wagmi
```

### Option B: Manual Download

1. Download this entire `/workspaces/codespaces-blank/belief-market` folder
2. Name it `wagmi`
3. Open terminal in that folder

---

## 📤 STEP 2: Push Code to GitHub

On your local machine:

```bash
cd wagmi

# Make sure we're on main branch
git branch -M main

# Push all code to GitHub
git push -u origin main
```

**You should see:**
```
Enumerating objects: 123, done.
...
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ Your code is now on GitHub!

**Verify:** https://github.com/talk2mugambi-afk/wagmi

---

## 🌐 STEP 3: Deploy to Vercel

### Web UI (Recommended - Easiest)

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. When prompted, authorize Vercel to access GitHub
4. Find and select: **talk2mugambi-afk/wagmi**
5. Click **"Import"**

### Configure Build Settings

On the setup screen, set:

```
Root Directory:    frontend
Build Command:     npm run build
Output Directory:  build
```

### Add Environment Variables

Click **"Environment Variables"** and add these **before deploying**:

```
REACT_APP_PROGRAM_ID    =  [YOUR_PROGRAM_ID]
REACT_APP_NETWORK       =  devnet
REACT_APP_RPC_URL       =  https://api.devnet.solana.com
```

⚠️ **Don't have Program ID yet?** 
- Use Solana Playground: https://beta.solpg.io/
- See: `SOLANA_PLAYGROUND.md` for detailed instructions

### Deploy!

Click **"Deploy"** and wait 2-3 minutes.

---

## 🎮 After Deployment

Vercel will give you a live URL:

```
https://wagmi-talk2mugambi-afk.vercel.app
```

Your WAGMI frontend is now LIVE! 🚀

---

## 📋 Quick Checklist

- [ ] Download/clone project locally
- [ ] `git push -u origin main` 
- [ ] Verify on GitHub: https://github.com/talk2mugambi-afk/wagmi
- [ ] Get Program ID from Solana Playground
- [ ] Go to https://vercel.com/new
- [ ] Import wagmi repo
- [ ] Set Root: `frontend`
- [ ] Add env vars
- [ ] Click Deploy
- [ ] Get live URL! 🎉

---

## 🆘 Troubleshooting

### "Permission denied" when pushing?
```bash
# Make sure you're authenticated
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Then try push again
git push -u origin main
```

### Vercel build fails?
- Check build logs in Vercel dashboard
- Make sure Root Directory is set to `frontend`
- Paste error message in chat and I'll help debug

### Can't find Program ID?
- Use: https://beta.solpg.io/
- See: `SOLANA_PLAYGROUND.md`
- I can help you deploy via Playground

---

## 📚 Full Documentation

- **FINAL_LAUNCH_STEPS.md** - Overview
- **SOLANA_PLAYGROUND.md** - Get Program ID
- **GITHUB_VERCEL_SETUP.md** - Detailed guide
- **DEPLOYMENT_OPTIONS.md** - All methods

---

## ✨ Next: Get Program ID

Once code is pushed and Vercel is deploying:

1. Go to: https://beta.solpg.io/
2. Create new Anchor project
3. Upload your contract files
4. Click Build → Deploy
5. Copy Program ID
6. Add to Vercel environment variables
7. Done! 🚀

---

## 🎉 You're Almost There!

Everything is ready. Just:

1. ✅ Push code locally
2. ✅ Deploy to Vercel
3. ✅ Get Program ID
4. ✅ Add env vars
5. ✅ WAGMI is LIVE!

