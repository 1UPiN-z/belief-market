# 📥 Download WAGMI to Your Local Machine

The Codespace has the complete WAGMI project, but due to GitHub token limitations, you need to download it to your local machine and push it.

## ✅ What You Need to Do

### Step 1: Download the Wagmi Folder from Codespace

**Option A: Using Codespaces Download**
1. In VS Code Codespaces (top left menu)
2. Click **"Codespaces"** 
3. Right-click on the **"belief-market"** folder
4. Select **"Download"**
5. Wait for ZIP download to complete
6. Extract it to your computer

**Option B: Via GitHub Web**
1. Go to: https://github.com/talk2mugambi-afk/wagmi
2. Click **"Code"** → **"Download ZIP"** (currently empty but will have files)
3. Extract it

**Option C: Manual Clone (After we push)**
```bash
git clone https://github.com/talk2mugambi-afk/wagmi.git
```

### Step 2: On Your Local Machine

Extract the wagmi folder and open terminal there:

```bash
cd wagmi
```

### Step 3: Push to GitHub

**Option A: Use the Script (Easiest)**
```bash
bash push-to-github.sh
```

**Option B: Copy/Paste Commands**
```bash
git config user.name "WAGMI Developer"
git config user.email "dev@wagmi.local"
git remote add origin https://github.com/talk2mugambi-afk/wagmi.git
git branch -M main
git push -u origin main --force
```

### Step 4: Verify on GitHub

Go to: https://github.com/talk2mugambi-afk/wagmi

You should see:
- ✅ All folders (programs/, frontend/, client/, tests/)
- ✅ All documentation files
- ✅ Configuration files (Anchor.toml, vercel.json, etc.)

### Step 5: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Click: **"Import Git Repository"**
3. Select: **talk2mugambi-afk/wagmi**
4. Set Root Directory: **frontend**
5. Deploy! 🚀

---

## 🎯 Complete Workflow

```
1. Download wagmi folder from Codespace
                    ↓
2. Open terminal in that folder
                    ↓
3. Run: bash push-to-github.sh
                    ↓
4. Wait for push to complete
                    ↓
5. Check: https://github.com/talk2mugambi-afk/wagmi
                    ↓
6. Go to: https://vercel.com/new
                    ↓
7. Deploy! 🚀
```

---

## ⏱️ Time Required

- Download: 2 minutes
- Push to GitHub: 1 minute  
- Deploy to Vercel: 3 minutes

**Total: ~6 minutes to LIVE!**

---

## ✨ After Deployment

Your WAGMI frontend will be live at:
```
https://wagmi-talk2mugambi-afk.vercel.app
```

---

## 🆘 Troubleshooting

**"Permission denied"**
```bash
# Make sure Git is configured
git config user.name "WAGMI Developer"
git config user.email "dev@wagmi.local"
```

**"Can't find push-to-github.sh"**
```bash
# Make sure you're in the wagmi folder
pwd  # Should show .../wagmi
```

**Push still fails?**
```bash
# Use this instead
git push -u origin main --force
```

---

## 📞 Need Help?

If anything goes wrong:
1. Copy the error message
2. Share it in chat
3. I'll help debug!

---

You got this! Download and push! 🚀
