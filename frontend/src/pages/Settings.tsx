import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Settings() {
  const { publicKey } = useWallet();
  const [settings, setSettings] = React.useState({
    notifications: true,
    darkMode: true,
    slippageTolerance: 1,
  });

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  if (!publicKey) {
    return (
      <div className="bg-slate-700 rounded-lg p-12 text-center">
        <p className="text-gray-300">Connect your wallet to access settings</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Account Settings */}
      <div className="bg-slate-700 rounded-lg p-8 mb-6">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

        {/* Wallet Info */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Wallet</h2>
          <div className="bg-slate-800 rounded p-4">
            <p className="text-sm text-gray-400 mb-2">Connected Address</p>
            <p className="text-white font-mono break-all">{publicKey?.toString()}</p>
          </div>
        </div>

        {/* Network Settings */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Network</h2>
          <div className="bg-slate-800 rounded p-4">
            <p className="text-sm text-gray-400 mb-2">Current Network</p>
            <p className="text-white font-bold">Solana Devnet</p>
            <p className="text-xs text-gray-400 mt-2">
              For mainnet deployment, contact the Belief Market team
            </p>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Preferences</h2>

          {/* Notifications */}
          <div className="bg-slate-800 rounded p-4 mb-4 flex justify-between items-center">
            <div>
              <p className="text-white font-bold">Notifications</p>
              <p className="text-sm text-gray-400">Receive alerts for market events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Dark Mode */}
          <div className="bg-slate-800 rounded p-4 mb-4 flex justify-between items-center">
            <div>
              <p className="text-white font-bold">Dark Mode</p>
              <p className="text-sm text-gray-400">Always enabled for comfort</p>
            </div>
            <span className="text-gray-400 font-bold">ON</span>
          </div>

          {/* Slippage */}
          <div className="bg-slate-800 rounded p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-bold">Slippage Tolerance</p>
              <p className="text-sm text-gray-400">Maximum price slippage allowed</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.slippageTolerance}
                onChange={(e) => handleChange('slippageTolerance', parseFloat(e.target.value))}
                className="w-20 bg-slate-600 text-white px-3 py-1 rounded border border-slate-500 text-right"
              />
              <span className="text-white">%</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition">
          Save Settings
        </button>
      </div>

      {/* API Documentation */}
      <div className="bg-slate-700 rounded-lg p-8">
        <h2 className="text-lg font-bold text-white mb-4">Developer Info</h2>
        <p className="text-gray-400 mb-4">
          To integrate Belief Market into your application, use our TypeScript SDK:
        </p>
        <pre className="bg-slate-800 rounded p-4 text-sm text-green-400 overflow-x-auto mb-4">
{`import { BelievMarketSDK } from '@belief-market/sdk';

const sdk = new BelievMarketSDK(provider);
await sdk.createMarket({...});`}
        </pre>
        <a href="https://github.com/belief-market/docs" className="text-blue-400 hover:underline">
          View Full Documentation →
        </a>
      </div>
    </div>
  );
}
