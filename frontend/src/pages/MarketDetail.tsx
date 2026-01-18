import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, BN } from '@solana/web3.js';

export default function MarketDetail() {
  const { marketId } = useParams<{ marketId: string }>();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0);
  const [amount, setAmount] = useState<string>('10');
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);

  useEffect(() => {
    if (publicKey && connection) {
      connection.getBalance(publicKey).then((bal) => {
        setUserBalance(bal / 1_000_000_000);
      });
    }
  }, [publicKey, connection]);

  async function handleBuyShares() {
    if (!publicKey || !amount) return;
    
    setLoading(true);
    try {
      // TODO: Integrate with actual SDK
      // const sdk = new BelievMarketSDK(provider);
      // await sdk.buyOutcome({
      //   marketPda: new PublicKey(marketId),
      //   outcomeIndex: selectedOutcome,
      //   amountUsdc: new BN(parseFloat(amount) * 1_000_000),
      // });
      
      console.log(`Buying ${amount} USDC of outcome ${selectedOutcome}`);
      alert('Integration pending - awaiting Program ID');
    } catch (error) {
      console.error('Error buying shares:', error);
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  if (!publicKey) {
    return (
      <div className="bg-slate-700 rounded-lg p-12 text-center">
        <p className="text-gray-300">Connect your wallet to view market details</p>
      </div>
    );
  }

  const outcomes = ['YES', 'NO'];
  const mockOdds = [0.65, 0.35];
  const mockPrice = mockOdds[selectedOutcome];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Market Header */}
        <div className="bg-slate-700 rounded-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            Will Bitcoin hit $100k by Jan 30?
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Market Volume</p>
              <p className="text-2xl font-bold text-white">$2,500 USDC</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-2xl font-bold text-green-400">Active</p>
            </div>
          </div>
        </div>

        {/* Odds Chart */}
        <div className="bg-slate-700 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-6">Market Odds</h2>
          <div className="space-y-4">
            {outcomes.map((outcome, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-bold">{outcome}</span>
                  <span className="text-white font-bold">{(mockOdds[idx] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      idx === 0 ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${mockOdds[idx] * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trading Panel */}
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg p-6 sticky top-20">
          <h3 className="text-xl font-bold text-white mb-6">Place Order</h3>

          {/* Outcome Selection */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Choose Outcome</label>
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(Number(e.target.value))}
              className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-400"
            >
              {outcomes.map((outcome, idx) => (
                <option key={idx} value={idx}>
                  {outcome} @ {(mockOdds[idx] * 100).toFixed(1)}%
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Amount (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10"
              className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-400"
            />
            <p className="text-xs text-gray-400 mt-2">Balance: {userBalance.toFixed(2)} SOL</p>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-800 rounded p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Order Price</span>
              <span className="text-white font-bold">${mockPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fee (1%)</span>
              <span className="text-white font-bold">${(parseFloat(amount) * 0.01).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between">
              <span className="text-white font-bold">Total Cost</span>
              <span className="text-blue-400 font-bold">
                ${(parseFloat(amount) * (1 + 0.01)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={handleBuyShares}
            disabled={loading || !amount}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Buy ${selectedOutcome === 0 ? 'YES' : 'NO'}`}
          </button>

          {/* Info */}
          <p className="text-xs text-gray-400 text-center mt-4">
            Ensure you have enough SOL for transaction fees
          </p>
        </div>
      </div>
    </div>
  );
}
