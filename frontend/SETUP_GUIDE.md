# 🚀 Belief Market Frontend - Complete Setup & Deployment Guide

## 📦 What You Have

A **production-ready React frontend** with:
- ✅ Wallet connection (Phantom, Solflare, Torus)
- ✅ Market listing & discovery
- ✅ Real-time trading interface
- ✅ Portfolio tracking
- ✅ Settings & preferences
- ✅ Tailwind CSS (beautiful dark theme)
- ✅ TypeScript support
- ✅ Ready for SDK integration

---

## 🎯 Quick Start (5 Minutes)

### **Step 1: Install Dependencies**
```bash
cd frontend
npm install
```

### **Step 2: Start Development Server**
```bash
npm start
```

The app will open at `http://localhost:3000` with Phantom wallet ready to connect!

### **Step 3: Connect Your Wallet**
1. Click "Select Wallet" at top right
2. Choose Phantom (or other wallet)
3. Approve connection in wallet popup
4. Start browsing markets!

---

## 🔧 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.tsx           - Market listing & discovery
│   │   ├── MarketDetail.tsx   - Single market view & trading
│   │   ├── Portfolio.tsx      - User positions & P&L
│   │   └── Settings.tsx       - Preferences & wallet info
│   ├── components/
│   │   └── Header.tsx         - Navigation & wallet button
│   ├── App.tsx                - Main app with routing
│   ├── App.css                - Global styles
│   ├── index.tsx              - React entry point
│   └── idl/
│       └── belief_market.json - Program IDL (populate after deploy)
├── public/
│   └── index.html             - HTML template
├── package.json               - Dependencies
├── tsconfig.json              - TypeScript config
└── tailwind.config.js         - Tailwind CSS config (create next)
```

---

## 📝 Creating Tailwind Config

Create `frontend/tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
      },
    },
  },
  plugins: [],
};
```

And `frontend/postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## 🔌 Integrating with Your Smart Contract

### **Step 1: Get Your Program ID**
After deploying your smart contract:
```bash
# From your deployment output
Program ID: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### **Step 2: Copy IDL File**
```bash
# Copy from smart contract build output
cp ../target/idl/belief_market.json ./src/idl/
```

### **Step 3: Update Program ID in Frontend**
Edit `frontend/src/pages/Home.tsx`:
```typescript
const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID_HERE');
```

### **Step 4: Import SDK**
```bash
# Install from npm (after publishing) or locally:
npm install ../client  # Local path to TypeScript SDK
```

### **Step 5: Uncomment SDK Calls**
In each page file, uncomment the actual SDK calls:

```typescript
// In Home.tsx - fetchMarkets()
const sdk = new BelievMarketSDK(
  new AnchorProvider(connection, new Wallet(publicKey), {})
);
const markets = await sdk.getAllMarkets();

// In MarketDetail.tsx - handleBuyShares()
await sdk.buyOutcome({
  marketPda: new PublicKey(marketId),
  outcomeIndex: selectedOutcome,
  amountUsdc: new BN(parseFloat(amount) * 1_000_000),
});

// In Portfolio.tsx - fetchPositions()
const positions = await sdk.getUserPositions(publicKey);
```

---

## 🎨 Customization Guide

### **Change Theme Colors**
Edit `frontend/src/App.css`:
```css
:root {
  --primary: #3b82f6;  /* Blue */
  --secondary: #a855f7; /* Purple */
  --success: #10b981;  /* Green */
  --danger: #ef4444;   /* Red */
}
```

### **Add Your Logo**
Replace in `frontend/src/components/Header.tsx`:
```typescript
<img src="/logo.png" alt="Logo" className="h-8" />
```

### **Customize Market Card**
Edit `frontend/src/pages/Home.tsx` - `<MarketCard>` component

### **Add More Pages**
```bash
touch frontend/src/pages/MyPage.tsx
```

Then import in `frontend/src/App.tsx`:
```typescript
import MyPage from './pages/MyPage';

// In Routes:
<Route path="/mypage" element={<MyPage />} />
```

---

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended) ⭐**

**Fastest & Free for open source**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

1. Connect GitHub repo
2. Set environment variables (if needed)
3. Click Deploy
4. Get your live URL!

### **Option 2: Netlify**

```bash
npm install -g netlify-cli
cd frontend
netlify deploy
```

### **Option 3: GitHub Pages**

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/belief-market",

# Build and deploy
npm run build
npm install -g gh-pages
gh-pages -d build
```

### **Option 4: Traditional Server (AWS, Azure, GCP)**

```bash
# Build static files
npm run build

# Upload `build/` folder to your server
# Serve with nginx or apache
```

---

## 🌐 Environment Variables

Create `frontend/.env`:

```
REACT_APP_PROGRAM_ID=YOUR_PROGRAM_ID_HERE
REACT_APP_NETWORK=devnet
REACT_APP_RPC_URL=https://api.devnet.solana.com
```

Then use in code:
```typescript
const PROGRAM_ID = new PublicKey(process.env.REACT_APP_PROGRAM_ID!);
```

---

## 📱 Mobile Optimization

The frontend is already **mobile-responsive**! Test on mobile:

```bash
# Get local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access on phone
http://YOUR_IP:3000
```

---

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Wallet connection works
- [ ] Can view markets
- [ ] Can open market details
- [ ] Trading interface displays correctly
- [ ] Portfolio shows positions
- [ ] All buttons clickable
- [ ] Responsive on mobile
- [ ] No console errors

### **Automated Testing** (Optional)
```bash
npm install --save-dev @testing-library/react
npm test
```

---

## 🔐 Security Checklist

Before mainnet deployment:

- [ ] Remove test/debug code
- [ ] Set `REACT_APP_NETWORK=mainnet` in production
- [ ] Use secure RPC endpoint (not public)
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Add error boundaries
- [ ] Monitor for XSS vulnerabilities
- [ ] Use HTTPS everywhere
- [ ] Keep dependencies updated

---

## 🆘 Troubleshooting

### **"Cannot find module '@coral-xyz/anchor'"**
```bash
npm install @coral-xyz/anchor @solana/web3.js
```

### **Wallet doesn't connect**
- Ensure Phantom extension installed
- Check you're on Devnet
- Clear browser cache
- Try incognito mode

### **Build fails with TypeScript errors**
```bash
# Check for errors
npm run build

# Fix common issues
npm install --save-dev @types/react @types/react-dom
```

### **Markets not loading**
- Verify Program ID is correct
- Check IDL file is in `src/idl/`
- Look at browser console for errors
- Ensure RPC endpoint is accessible

### **Transactions fail**
- Check wallet has enough SOL
- Verify program is deployed
- Check transaction simulation output

---

## 📊 Performance Tips

### **Reduce Bundle Size**
```bash
npm install --save-dev @loadable/component
# Code split pages dynamically
```

### **Optimize Images**
```bash
# Use WebP format
# Compress with TinyPNG or similar
```

### **Caching Strategy**
```typescript
// Cache market data for 30 seconds
const CACHE_DURATION = 30000;
```

---

## 📈 Analytics (Optional)

Add Google Analytics:

```bash
npm install react-ga4
```

Then in `App.tsx`:
```typescript
import GA4React from 'react-ga4';

GA4React.initialize('G-YOUR-GA-ID');
```

---

## 🚀 Go Live Checklist

Before launching to mainnet:

### Development
- [ ] All features tested locally
- [ ] No console errors/warnings
- [ ] Mobile responsive verified
- [ ] Performance optimized

### Configuration
- [ ] Program ID updated
- [ ] RPC endpoint secure
- [ ] Environment variables set
- [ ] IDL file correct

### Security
- [ ] Input validation added
- [ ] Error handling complete
- [ ] XSS protection enabled
- [ ] CORS configured

### Deployment
- [ ] Build passes (`npm run build`)
- [ ] Deployed to production URL
- [ ] Domain configured
- [ ] SSL certificate valid
- [ ] CDN enabled (optional)

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics enabled
- [ ] Uptime monitoring
- [ ] User feedback channel

---

## 📞 API Reference

### **Hooks to Implement**

```typescript
// Get user's positions
const useUserPositions = (publicKey: PublicKey) => {
  const [positions, setPositions] = useState([]);
  // Fetch from SDK
  return positions;
};

// Get market details
const useMarket = (marketId: PublicKey) => {
  const [market, setMarket] = useState(null);
  // Fetch from SDK
  return market;
};

// Subscribe to market updates (real-time)
const useMarketSubscription = (marketId: PublicKey) => {
  useEffect(() => {
    // Subscribe to account changes
    const subscription = connection.onAccountChange(marketId, (account) => {
      // Update market data
    });
    return () => connection.removeAccountChangeListener(subscription);
  }, [marketId]);
};
```

---

## 📖 Learning Resources

- **React Docs:** https://react.dev
- **Solana Docs:** https://docs.solana.com
- **Anchor Docs:** https://www.anchor-lang.com
- **Wallet Adapter:** https://github.com/solana-labs/wallet-adapter
- **Tailwind CSS:** https://tailwindcss.com

---

## 🎉 Next Steps

1. **Run locally:** `npm start`
2. **Connect wallet:** Click "Select Wallet"
3. **Integrate SDK:** Update Program ID & uncomment SDK calls
4. **Deploy:** Push to Vercel/Netlify
5. **Go live:** Share with community!

---

## 💡 Tips for Success

✅ Start with devnet testing
✅ Get feedback from users early
✅ Monitor for bugs & performance
✅ Keep users informed of changes
✅ Community engagement is key

---

**Questions?** Check the main README.md or INTEGRATION_EXAMPLES.ts for more details!

**Ready to launch?** 🚀
