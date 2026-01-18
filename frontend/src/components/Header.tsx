import React from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'WAGMI' }: HeaderProps) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = React.useState(0);

  React.useEffect(() => {
    if (publicKey && connection) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / 1_000_000_000); // Convert lamports to SOL
      });
    }
  }, [publicKey, connection]);

  return (
    <header className="bg-slate-800 shadow-lg border-b border-slate-700">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            🚀 {title}
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition">
            Markets
          </Link>
          <Link to="/portfolio" className="text-gray-300 hover:text-white transition">
            Portfolio
          </Link>
          <Link to="/settings" className="text-gray-300 hover:text-white transition">
            Settings
          </Link>
        </div>

        {/* Wallet Info */}
        <div className="flex items-center gap-4">
          {publicKey && (
            <div className="text-sm text-gray-300">
              Balance: <span className="font-bold text-white">{balance.toFixed(2)} SOL</span>
            </div>
          )}
          <WalletMultiButton />
        </div>
      </nav>
    </header>
  );
}
