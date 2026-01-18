# 🚀 Belief Market Deployment Instructions

**Your Wallet Address:** `6DjxNQWJ7Zfd6f9AGgaTLk3FwEpbsnqU3sQLPszKFM5a`

## Step 1: Install Solana CLI (On Your Local Machine)

If you don't already have it installed:

```bash
# macOS/Linux
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Or Windows
# Download from https://github.com/solana-labs/solana/releases
```

## Step 2: Configure for Eclipse Testnet

```bash
# Set Eclipse testnet as your RPC endpoint
solana config set --url https://api.dev2.solana.superfast_test.com

# Verify configuration
solana config get
```

Expected output:
```
Config File: ~/.config/solana/cli/config.yml
RPC URL: https://api.dev2.solana.superfast_test.com
WebSocket URL: (calculated)
Keypair Path: ~/.config/solana/id.json
Commitment: confirmed
```

## Step 3: Create or Import Your Keypair

### Option A: Generate a new keypair (local testing)
```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

### Option B: Import existing keypair
```bash
# If you have a seed phrase or private key
solana-keygen recover --outfile ~/.config/solana/id.json
```

## Step 4: Request Test SOL Airdrop

```bash
# Request 5 SOL for testing
solana airdrop 5 6DjxNQWJ7Zfd6f9AGgaTLk3FwEpbsnqU3sQLPszKFM5a --url https://api.dev2.solana.superfast_test.com

# Check balance
solana balance 6DjxNQWJ7Zfd6f9AGgaTLk3FwEpbsnqU3sQLPszKFM5a --url https://api.dev2.solana.superfast_test.com
```

## Step 5: Deploy the Program

From your local machine (in the belief-market directory):

```bash
# Build the program
anchor build

# Deploy to Eclipse testnet
anchor deploy --provider.cluster https://api.dev2.solana.superfast_test.com
```

### Expected Output:
```
Program ID: <YOUR_PROGRAM_ID_HERE>
```

**SAVE THIS PROGRAM ID** - you'll need it for the next step!

## Step 6: Update Anchor.toml with Program ID

Edit `Anchor.toml` and replace the placeholder program ID:

```toml
[programs.eclipse]
belief_market = "YOUR_PROGRAM_ID_HERE"
```

## Step 7: Run Tests

```bash
# Run all tests
anchor test --provider.cluster https://api.dev2.solana.superfast_test.com

# Expected: ✅ All 13 tests should PASS
```

## Step 8: Generate TypeScript Types (IDL)

```bash
# The IDL is automatically generated at:
# target/idl/belief_market.json

# Copy it to client SDK:
cp target/idl/belief_market.json client/idl.json
```

## Step 9: Test with TypeScript SDK

```bash
cd client
npm install

# Create a test script to use the SDK
# See INTEGRATION_EXAMPLES.ts for examples
```

---

## 🎯 Quick Command Reference

```bash
# Check wallet balance
solana balance 6DjxNQWJ7Zfd6f9AGgaTLk3FwEpbsnqU3sQLPszKFM5a --url https://api.dev2.solana.superfast_test.com

# Build the program
anchor build

# Deploy to testnet
anchor deploy --provider.cluster https://api.dev2.solana.superfast_test.com

# Run tests
anchor test --provider.cluster https://api.dev2.solana.superfast_test.com

# Get program info
solana program show <PROGRAM_ID> --url https://api.dev2.solana.superfast_test.com
```

---

## 🔗 Useful Links

- **Eclipse Testnet Explorer:** https://explorer.dev2.solana.superfast_test.com
- **Solana Docs:** https://docs.solana.com
- **Anchor Docs:** https://www.anchor-lang.com
- **Your Wallet:** `6DjxNQWJ7Zfd6f9AGgaTLk3FwEpbsnqU3sQLPszKFM5a`

---

## ⚠️ Important Notes

1. **Save your program ID** - You'll need it for frontend integration
2. **Keep your keypair safe** - Don't commit `id.json` to version control
3. **Test SOL is temporary** - Will be cleared if testnet resets
4. **Frontend integration** - Use the Program ID in your SDK initialization

---

## 📋 Deployment Checklist

- [ ] Installed Solana CLI
- [ ] Configured Eclipse testnet RPC
- [ ] Generated/imported keypair
- [ ] Got test SOL airdrop (balance > 0)
- [ ] Built program (`anchor build`)
- [ ] Deployed program (`anchor deploy`)
- [ ] Saved Program ID
- [ ] Updated `Anchor.toml`
- [ ] Ran tests (`anchor test`)
- [ ] Generated IDL
- [ ] Created first market (optional)

---

## 🆘 Troubleshooting

### "Connection refused" error
- Check your RPC endpoint is correct
- Try: `solana ping --url https://api.dev2.solana.superfast_test.com`

### "Insufficient funds" error
- Request more test SOL: `solana airdrop 10 <ADDRESS>`

### "Program verification failed"
- Rebuild: `anchor clean && anchor build`
- Check Rust version: `rustc --version`

### Tests fail after deployment
- Verify Program ID in tests matches deployed ID
- Check IDL matches program

---

**Next Step:** Run the deployment commands on your local machine following Steps 1-7 above. Once you have your Program ID, share it and I'll help with frontend integration! 🚀
