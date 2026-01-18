import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, BN } from '@solana/web3.js';

interface Position {
  marketId: string;
  marketTitle: string;
  outcomeIndex: number;
  shares: number;
  currentValue: number;
  entryValue: number;
  pnl: number;
  status: 'active' | 'resolved' | 'won' | 'lost';
}

export default function Portfolio() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);

  useEffect(() => {
    if (publicKey && connection) {
      fetchPositions();
    }
  }, [publicKey, connection]);

  useEffect(() => {
    const total = positions.reduce((sum, p) => sum + p.currentValue, 0);
    const pnl = positions.reduce((sum, p) => sum + p.pnl, 0);
    setTotalValue(total);
    setTotalPnL(pnl);
  }, [positions]);

  async function fetchPositions() {
    setLoading(true);
    try {
      // TODO: Integrate with actual SDK
      // const sdk = new BelievMarketSDK(provider);
      // const positions = await sdk.getUserPositions(publicKey);
      
      // Mock data for UI
      const mockPositions: Position[] = [
        {
          marketId: 'market-1',
          marketTitle: 'Will Bitcoin hit $100k?',
          outcomeIndex: 0,
          shares: 100,
          currentValue: 150,
          entryValue: 100,
          pnl: 50,
          status: 'active',
        },
        {
          marketId: 'market-2',
          marketTitle: 'Will Solana hit $100 by year end?',
          outcomeIndex: 1,
          shares: 50,
          currentValue: 30,
          entryValue: 50,
          pnl: -20,
          status: 'active',
        },
      ];
      
      setPositions(mockPositions);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!publicKey) {
    return (
      <div className="bg-slate-700 rounded-lg p-12 text-center">
        <p className="text-gray-300">Connect your wallet to view your portfolio</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Portfolio Value</p>
          <p className="text-3xl font-bold text-white">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Unrealized P&L</p>
          <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} USDC
          </p>
        </div>
        <div className="bg-slate-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Open Positions</p>
          <p className="text-3xl font-bold text-white">{positions.filter(p => p.status === 'active').length}</p>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-slate-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-600">
          <h2 className="text-xl font-bold text-white">Your Positions</h2>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-gray-400">Loading positions...</div>
        ) : positions.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            You have no open positions yet. <br />
            Visit Markets to start trading!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-400 text-sm font-semibold">Market</th>
                  <th className="px-6 py-3 text-left text-gray-400 text-sm font-semibold">Outcome</th>
                  <th className="px-6 py-3 text-left text-gray-400 text-sm font-semibold">Shares</th>
                  <th className="px-6 py-3 text-left text-gray-400 text-sm font-semibold">Entry</th>
                  <th className="px-6 py-3 text-left text-gray-400 text-sm font-semibold">Current</th>
                  <th className="px-6 py-3 text-left text-gray-400 text-sm font-semibold">P&L</th>
                  <th className="px-6 py-3 text-left text-gray-400 text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.marketId} className="border-b border-slate-600 hover:bg-slate-600/50 transition">
                    <td className="px-6 py-4 text-white">{position.marketTitle}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm font-bold ${
                        position.outcomeIndex === 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {position.outcomeIndex === 0 ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">{position.shares}</td>
                    <td className="px-6 py-4 text-gray-300">${position.entryValue.toFixed(2)}</td>
                    <td className="px-6 py-4 text-white font-bold">${position.currentValue.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={position.pnl >= 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                        {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-xs font-bold ${
                        position.status === 'active'
                          ? 'bg-blue-500/20 text-blue-400'
                          : position.status === 'won'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
