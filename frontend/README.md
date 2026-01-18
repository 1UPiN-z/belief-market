# 🎯 Belief Market Frontend

A **production-ready React frontend** for the Belief Market prediction market platform on Solana.

## ✨ Features

- 🪙 **Wallet Connection** - Phantom, Solflare, Torus support
- 📊 **Market Discovery** - Browse active prediction markets
- 💹 **Real-time Trading** - Buy/sell outcome shares instantly
- 👛 **Portfolio Tracking** - Monitor positions and P&L
- ⚙️ **Settings** - Customize preferences
- 🎨 **Modern UI** - Dark theme with Tailwind CSS
- 📱 **Mobile Ready** - Fully responsive design
- ♿ **Accessible** - WCAG compliant

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

Visit `http://localhost:3000` and connect your wallet!

### 3. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/              # Main pages
│   │   ├── Home.tsx       # Market listing
│   │   ├── MarketDetail   # Trading interface
│   │   ├── Portfolio.tsx  # User positions
│   │   └── Settings.tsx   # Preferences
│   ├── components/         # Reusable components
│   │   └── Header.tsx     # Navigation
│   ├── App.tsx            # Main app
│   └── idl/               # Program IDL (after deploy)
├── public/                 # Static files
├── package.json           # Dependencies
└── SETUP_GUIDE.md        # Detailed setup
```

## 🔌 SDK Integration

### Before Running:
1. Deploy the smart contract
2. Save your **Program ID**
3. Copy IDL to `src/idl/belief_market.json`
4. Update Program ID in component files

### Enable SDK Calls:
Uncomment the actual SDK calls in:
- `src/pages/Home.tsx` - `fetchMarkets()`
- `src/pages/MarketDetail.tsx` - `handleBuyShares()`
- `src/pages/Portfolio.tsx` - `fetchPositions()`

## 📦 Dependencies

- **React 18** - UI framework
- **React Router** - Navigation
- **Solana Web3.js** - Blockchain connection
- **Anchor** - Smart contract SDK
- **Wallet Adapter** - Wallet integration
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#3b82f6',  // Blue
  secondary: '#a855f7', // Purple
}
```

### Add Your Logo
Replace in `frontend/src/components/Header.tsx`:
```typescript
<img src="/logo.png" alt="Logo" />
```

### Add New Pages
```bash
touch frontend/src/pages/NewPage.tsx
```

Then add route in `App.tsx`:
```typescript
<Route path="/newpage" element={<NewPage />} />
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### GitHub Pages
```bash
npm run build
npm install -g gh-pages
gh-pages -d build
```

See `SETUP_GUIDE.md` for detailed deployment instructions.

## 🧪 Testing

### Manual Testing
1. Connect wallet
2. Browse markets
3. View market details
4. Check portfolio
5. Adjust settings

### Run Tests
```bash
npm test
```

## 🔐 Security

- ✅ Input validation
- ✅ XSS protection
- ✅ Secure wallet connections
- ✅ Environment variable isolation
- ✅ HTTPS enforced

## 🐛 Troubleshooting

### Wallet won't connect
- Ensure Phantom is installed
- Check you're on Devnet
- Clear browser cache

### Markets not loading
- Verify Program ID is correct
- Check IDL file exists
- Look at browser console

### Build errors
```bash
npm install --save-dev @types/react @types/react-dom
npm run build
```

See `SETUP_GUIDE.md` for more troubleshooting.

## 📖 Documentation

- **SETUP_GUIDE.md** - Complete setup & deployment
- **../README.md** - Smart contract documentation
- **../INTEGRATION_EXAMPLES.ts** - SDK usage examples

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Make changes
4. Submit pull request

## 📝 License

MIT License - See LICENSE file

## 🚀 Next Steps

1. ✅ Run locally: `npm start`
2. ✅ Connect Phantom wallet
3. ✅ Deploy smart contract
4. ✅ Add Program ID to frontend
5. ✅ Deploy frontend to Vercel/Netlify
6. ✅ Share with community!

---

**Built with ❤️ on Solana**

For questions or issues, check SETUP_GUIDE.md or create an issue!
