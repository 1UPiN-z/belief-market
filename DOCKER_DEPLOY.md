# 🐳 WAGMI - Docker Deployment Guide

## Why Docker?

✅ No setup needed
✅ Everything pre-installed (Rust, Solana CLI, Anchor, Node.js)
✅ Consistent environment
✅ Works on Mac, Linux, Windows (WSL)
✅ Fast build process

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Docker

**Mac/Windows:**
- Download: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

**Linux:**
```bash
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker  # Refresh group membership
```

### Step 2: Run Docker Build

```bash
cd wagmi  # Your project folder
bash DOCKER_BUILD.sh
```

This will:
1. Build the Docker image
2. Compile the smart contract
3. Generate the IDL file
4. Show you the output

### Step 3: Done!

Your smart contract is built and ready. The IDL is in `target/idl/`.

---

## 📦 What Happens Inside Docker

```
Docker Container
├─ Rust 1.75.0
├─ Solana CLI v1.18.0
├─ Anchor CLI (latest)
├─ Node.js + npm
└─ Your WAGMI Project
    ├─ Builds smart contract
    ├─ Generates IDL
    └─ Ready for deployment
```

---

## 🎯 Manual Docker Commands

If you want to run things manually:

```bash
# Build the Docker image
docker-compose build wagmi-builder

# Start interactive shell in container
docker-compose run --rm wagmi-builder bash

# Inside the container, run:
cd /workspace
solana config set --url https://api.devnet.solana.com
anchor build
anchor deploy --provider.cluster devnet
```

---

## 📝 Your Workflow

### Development & Building:
```bash
# On your machine
cd wagmi

# Option A: One-click build
bash DOCKER_BUILD.sh

# Option B: Interactive docker
docker-compose run --rm wagmi-builder bash
# Then inside: anchor build
```

### Deployment:
```bash
# After building, you have:
target/idl/belief_market.json         # Frontend uses this
target/deploy/wagmi.so                # Your compiled contract

# To deploy to devnet (inside Docker):
anchor deploy --provider.cluster devnet
# Save the Program ID!
```

### Frontend Integration:
```bash
# On your machine (NOT in Docker)
cd wagmi/frontend
echo "REACT_APP_PROGRAM_ID=<YOUR_PROGRAM_ID>" > .env
npm install
npm start
```

---

## 🔧 Troubleshooting

### Docker not starting?
```bash
# Make sure Docker daemon is running
docker ps

# If not, start Docker Desktop (Mac/Windows) or run:
sudo systemctl start docker  # Linux
```

### Build fails in Docker?
```bash
# Clean and rebuild
docker-compose down -v
docker-compose build --no-cache wagmi-builder
bash DOCKER_BUILD.sh
```

### Permission denied?
```bash
# Linux users: add yourself to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Can't find tools inside Docker?
```bash
# Verify tools are installed
docker-compose run --rm wagmi-builder bash -c "
  rustc --version
  anchor --version
  solana --version
  npm --version
"
```

---

## 📊 Docker File Structure

```
Dockerfile          ← Docker image definition
docker-compose.yml  ← Docker Compose configuration
DOCKER_BUILD.sh     ← Automated build script
DOCKER_DEPLOY.md    ← This file
```

---

## ✨ Advanced Usage

### Build Everything and Deploy:
```bash
docker-compose run --rm wagmi-builder bash -c '
  cd /workspace
  solana config set --url https://api.devnet.solana.com
  anchor build
  anchor deploy --provider.cluster devnet
'
```

### Just Build (No Deploy):
```bash
docker-compose run --rm wagmi-builder bash -c '
  cd /workspace
  anchor build
'
```

### Run Tests:
```bash
docker-compose run --rm wagmi-builder bash -c '
  cd /workspace
  anchor test
'
```

---

## 🎯 Production Build

For production builds:

```bash
# Create optimized build
docker-compose build --no-cache wagmi-builder

# Deploy to mainnet
docker-compose run --rm wagmi-builder bash -c '
  cd /workspace
  solana config set --url https://api.mainnet-beta.solana.com
  anchor build
  anchor deploy --provider.cluster mainnet-beta
'
```

---

## 📚 Documentation

- **DOCKER_BUILD.sh** - Automated build script
- **WAGMI_DEPLOY.md** - General deployment guide
- **README_DEPLOY.md** - Detailed instructions
- **Dockerfile** - Docker configuration

---

## 🎉 You're Ready!

Everything you need is in Docker. No local setup required!

```bash
# One command to build
bash DOCKER_BUILD.sh

# Then deploy locally with the Program ID you get
```

Good luck! 🚀

