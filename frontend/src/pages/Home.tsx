import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, BN } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import idl from '../idl/belief_market.json';

const PROGRAM_ID = new PublicKey('11111111111111111111111111111111'); // Replace with your Program ID

interface Market {
  pubkey: PublicKey;
  creator: PublicKey;
  numOutcomes: number;
  outcomePools: BN[];
  outcomeShares: BN[];
  resolved: boolean;
  winningOutcome?: number;
  volume: BN;
  createdAt: BN;
}

export default function Home() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (publicKey && connection) {
      fetchMarkets();
    }
  }, [publicKey, connection]);

  async function fetchMarkets() {
    setLoading(true);
    try {
      // Note: Replace with actual SDK call after deployment
      // For now, showing UI structure
      const mockMarkets: Market[] = [
        {
          pubkey: new PublicKey('11111111111111111111111111111111'),
          creator: new PublicKey('11111111111111111111111111111111'),
          numOutcomes: 2,
          outcomePools: [new BN(1000000000), new BN(1500000000)],
          outcomeShares: [new BN(1000), new BN(1500)],
          resolved: false,
          volume: new BN(2500000000),
          createdAt: new BN(Math.floor(Date.now() / 1000)),
        },
      ];
      setMarkets(mockMarkets);
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">WAGMI Markets 🚀</h1>
            <p className="text-gray-400">We're All Gonna Make It - Decentralized Predictions</p>
          </div>
          {publicKey && (
            <Link
              to="/market/create"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-bold"
            >
              + Create Market
            </Link>
          )}
        </div>
      </div>

      {!publicKey ? (
        <div className="bg-slate-700 rounded-lg p-12 text-center">
          <p className="text-gray-300 mb-4">Connect your wallet to view and trade markets</p>
        </div>
      ) : loading ? (
        <div className="text-center text-gray-300">Loading markets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center py-8">No markets yet</p>
          ) : (
            markets.map((market) => (
              <Link
                key={market.pubkey.toString()}
                to={`/market/${market.pubkey.toString()}`}
                className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition cursor-pointer border border-slate-600 hover:border-blue-400"
              >
                {/* Market Card */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-bold mb-2">Sample Market</h3>
                    <p className="text-sm text-gray-400">
                      {market.numOutcomes} outcomes
                    </p>
                  </div>
                  {market.resolved ? (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs">
                      Resolved
                    </span>
                  ) : (
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs">
                      Active
                    </span>
                  )}
                </div>

                {/* Odds */}
                <div className="bg-slate-800 rounded p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-2">Outcome Odds</p>
                  <div className="flex gap-2">
                    {market.outcomePools.map((pool, idx) => {
                      const odds = market.outcomeShares[idx]?.toNumber() > 0
                        ? (pool.toNumber() / market.outcomeShares[idx].toNumber() * 100).toFixed(1)
                        : '0';
                      return (
                        <div key={idx} className="flex-1 text-center">
                          <div className="text-white font-bold">{odds}%</div>
                          <div className="text-xs text-gray-400">Outcome {idx + 1}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Volume */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Volume</span>
                  <span className="text-white font-bold">
                    ${(market.volume.toNumber() / 1_000_000).toFixed(2)} USDC
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
