// TypeScript Integration Examples for Belief Market SDK

import { AnchorProvider, Wallet, Program, BN } from "@anchor-lang/anchor";
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import BelievMarketSDK, { PROGRAM_ID, USDC_MINT } from "@belief-market/client";
import Utils from "@belief-market/client/utils";

/**
 * EXAMPLE 1: Complete Market Lifecycle
 * Shows: Create → Buy → Sell → Resolve → Redeem → Claim Peg
 */
async function completeMarketLifecycle(
  connection: Connection,
  authority: Keypair,
  creator: Keypair,
  trader1: Keypair,
  trader2: Keypair
) {
  const provider = new AnchorProvider(
    connection,
    new Wallet(authority),
    { commitment: "confirmed" }
  );
  const sdk = new BelievMarketSDK(provider);

  console.log("=== MARKET LIFECYCLE EXAMPLE ===\n");

  // Step 1: Initialize Global State (once, by authority)
  console.log("1. Initializing global state...");
  const platformWallet = Keypair.generate();
  await sdk.initializeGlobal(authority, platformWallet.publicKey);
  console.log("✓ Global state initialized\n");

  // Step 2: Users initialize profiles
  console.log("2. Setting up user profiles...");
  await sdk.initializeUser(creator, "creator_code");
  await sdk.initializeUser(trader1, "trader1_code");
  console.log("✓ User profiles created\n");

  // Step 3: Creator creates a market
  console.log("3. Creating prediction market...");
  const resolveAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  const [marketPda] = BelievMarketSDK.getMarketPda(creator.publicKey, resolveAt);

  const tx1 = await sdk.createMarket(
    creator,
    3,
    ["Trump", "Harris", "Other"],
    ["us-election", "2024"],
    250, // 2.5% trading fee
    resolveAt,
    getAssociatedTokenAddressSync(USDC_MINT, creator.publicKey),
    getAssociatedTokenAddressSync(USDC_MINT, platformWallet.publicKey)
  );
  console.log("✓ Market created:", marketPda.toBase58());
  console.log("  Signature:", tx1, "\n");

  // Step 4: Traders buy shares
  console.log("4. Traders buying shares...");
  const marketTokenAccount = getAssociatedTokenAddressSync(
    USDC_MINT,
    marketPda
  );

  const tx2 = await sdk.buyOutcome(
    trader1,
    marketPda,
    0, // Buy "Trump"
    100_000_000, // 100 USDC
    getAssociatedTokenAddressSync(USDC_MINT, trader1.publicKey),
    marketTokenAccount
  );
  console.log("✓ Trader 1 bought 'Trump' shares for 100 USDC");

  const tx3 = await sdk.buyOutcome(
    trader2,
    marketPda,
    1, // Buy "Harris"
    200_000_000, // 200 USDC
    getAssociatedTokenAddressSync(USDC_MINT, trader2.publicKey),
    marketTokenAccount
  );
  console.log("✓ Trader 2 bought 'Harris' shares for 200 USDC\n");

  // Step 5: Check odds before resolution
  console.log("5. Current market odds...");
  const odds = await sdk.getMarketOdds(marketPda);
  for (const odd of odds) {
    const percentage = (odd.odds_bps / 100).toFixed(2);
    console.log(`  ${odd.outcome_label}: ${percentage}%`);
  }
  console.log();

  // Step 6: Trader sells some shares (optional)
  console.log("6. Trader hedging position...");
  // In real scenario, fetch user's shares from tracking account
  // For demo, assume trader1 has 50 shares
  const tx4 = await sdk.sellOutcome(
    trader1,
    marketPda,
    0, // Sell "Trump"
    25_000_000, // Sell 25 shares
    getAssociatedTokenAddressSync(USDC_MINT, trader1.publicKey),
    marketTokenAccount
  );
  console.log("✓ Trader 1 sold 25 'Trump' shares\n");

  // Step 7: Wait for resolution time (in real scenario)
  console.log("7. Waiting for resolution time... (simulated)");
  console.log("   In production: wait for resolveAt timestamp\n");

  // Step 8: Authority resolves market
  console.log("8. Market resolution...");
  const tx5 = await sdk.resolveMarket(authority, marketPda, 0); // Trump wins
  console.log("✓ Market resolved: 'Trump' wins\n");

  // Step 9: Winners redeem shares
  console.log("9. Winners redeeming winnings...");
  // Assume trader1 has remaining shares to redeem
  const tx6 = await sdk.redeemWinnings(
    trader1,
    marketPda,
    25_000_000, // Redeem 25 remaining shares
    getAssociatedTokenAddressSync(USDC_MINT, trader1.publicKey),
    marketTokenAccount
  );
  console.log("✓ Trader 1 redeemed winnings\n");

  // Step 10: Creator claims peg
  console.log("10. Creator claiming $1 peg...");
  const tx7 = await sdk.claimPeg(
    creator,
    marketPda,
    getAssociatedTokenAddressSync(USDC_MINT, creator.publicKey),
    marketTokenAccount
  );
  console.log("✓ Creator claimed $1 peg\n");

  // Step 11: Withdraw fees
  console.log("11. Withdrawing accumulated fees...");
  const tx8 = await sdk.withdrawFees(
    creator,
    marketPda,
    getAssociatedTokenAddressSync(USDC_MINT, creator.publicKey),
    getAssociatedTokenAddressSync(USDC_MINT, creator.publicKey), // invitor
    getAssociatedTokenAddressSync(USDC_MINT, platformWallet.publicKey),
    marketTokenAccount
  );
  console.log("✓ Fees distributed\n");

  console.log("=== LIFECYCLE COMPLETE ===\n");
}

/**
 * EXAMPLE 2: Advanced Trading Strategy
 * Shows: Buy, calculate position value, sell at profit
 */
async function tradingStrategy(
  connection: Connection,
  trader: Keypair,
  marketPda: PublicKey
) {
  const provider = new AnchorProvider(
    connection,
    new Wallet(trader),
    { commitment: "confirmed" }
  );
  const sdk = new BelievMarketSDK(provider);

  console.log("=== TRADING STRATEGY EXAMPLE ===\n");

  // Fetch market data
  const market = await sdk.getMarket(marketPda);
  console.log("Market Outcomes:");
  for (let i = 0; i < market.num_outcomes; i++) {
    const odds = Utils.calculateOdds(
      market.outcome_pools[i],
      Utils.calculateOdds(0, 0) // total pool
    );
    console.log(
      `  ${i}. ${market.outcome_labels[i]}: ${odds.toFixed(2)}% odds`
    );
  }
  console.log();

  // Strategy: Identify undervalued outcome
  const outcomes = market.outcome_pools.map((pool, idx) => ({
    index: idx,
    pool: pool,
    label: market.outcome_labels[idx],
  }));

  const minPool = outcomes.reduce((min, curr) =>
    curr.pool < min.pool ? curr : min
  );

  console.log("Strategy: Buy undervalued outcome");
  console.log(`  Outcome: ${minPool.label} (lowest pool: ${minPool.pool})\n`);

  // Buy shares
  const buyAmount = 50_000_000; // 50 USDC
  console.log(`Buying ${Utils.formatUsdc(buyAmount)} USDC worth of shares...`);

  const tx1 = await sdk.buyOutcome(
    trader,
    marketPda,
    minPool.index,
    buyAmount,
    getAssociatedTokenAddressSync(PublicKey.default, trader.publicKey),
    getAssociatedTokenAddressSync(PublicKey.default, marketPda)
  );
  console.log("✓ Buy order executed\n");

  // Monitor position (in real scenario)
  console.log("Position Monitoring:");
  console.log(`  Entry Cost: ${Utils.formatUsdc(buyAmount)} USDC`);
  console.log(`  Current Odds: ${minPool.pool}/${market.outcome_pools.reduce((a, b) => a + b, 0)}`);
  console.log("  Status: HOLD for better odds\n");

  // Sell at profit (example)
  console.log("Profit Target Reached - Selling...");
  const tx2 = await sdk.sellOutcome(
    trader,
    marketPda,
    minPool.index,
    25_000_000, // Sell half position
    getAssociatedTokenAddressSync(PublicKey.default, trader.publicKey),
    getAssociatedTokenAddressSync(PublicKey.default, marketPda)
  );
  console.log("✓ Sell order executed at profit\n");

  console.log("=== STRATEGY COMPLETE ===\n");
}

/**
 * EXAMPLE 3: Portfolio Management
 * Shows: Calculate positions, track value, manage multiple markets
 */
async function portfolioManagement(
  connection: Connection,
  trader: Keypair,
  marketPdas: PublicKey[]
) {
  const provider = new AnchorProvider(
    connection,
    new Wallet(trader),
    { commitment: "confirmed" }
  );
  const sdk = new BelievMarketSDK(provider);

  console.log("=== PORTFOLIO MANAGEMENT EXAMPLE ===\n");

  let totalInvested = 0;
  let totalValue = 0;
  const positions = [];

  for (const marketPda of marketPdas) {
    const market = await sdk.getMarket(marketPda);
    const odds = await sdk.getMarketOdds(marketPda);

    // Calculate portfolio metrics (in real scenario, fetch from user shares account)
    const shares = 100; // Example
    const invested = 100_000_000; // 100 USDC
    const currentOdds = odds[0].odds_bps / 100;

    positions.push({
      market: marketPda,
      shares,
      invested,
      odds: currentOdds,
    });

    totalInvested += invested;
  }

  console.log("Current Portfolio:\n");
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    console.log(`Market ${i + 1}:`);
    console.log(`  Position: ${pos.shares} shares`);
    console.log(`  Invested: ${Utils.formatUsdc(pos.invested)} USDC`);
    console.log(`  Current Odds: ${pos.odds.toFixed(2)}%`);

    const upside = (pos.invested / pos.odds) * 100 - pos.invested;
    console.log(`  Potential Profit: ${Utils.formatUsdc(upside)} USDC\n`);
  }

  console.log(`Total Invested: ${Utils.formatUsdc(totalInvested)} USDC`);
  console.log(`Portfolio Allocation:`);
  for (let i = 0; i < positions.length; i++) {
    const pct = (positions[i].invested / totalInvested) * 100;
    console.log(`  Market ${i + 1}: ${pct.toFixed(1)}%`);
  }
  console.log("\n=== PORTFOLIO ANALYSIS COMPLETE ===\n");
}

/**
 * EXAMPLE 4: Risk Management
 * Shows: Stop-loss, position sizing, emergency pause
 */
async function riskManagement(
  connection: Connection,
  authority: Keypair,
  trader: Keypair,
  marketPda: PublicKey
) {
  const provider = new AnchorProvider(
    connection,
    new Wallet(authority),
    { commitment: "confirmed" }
  );
  const sdk = new BelievMarketSDK(provider);

  console.log("=== RISK MANAGEMENT EXAMPLE ===\n");

  // Risk Parameters
  const MAX_POSITION_SIZE = 500_000_000; // 500 USDC
  const STOP_LOSS_PCT = 20; // Stop loss at 20% loss
  const MAX_PORTFOLIO_CONCENTRATION = 0.3; // Max 30% in one market

  console.log("Risk Parameters:");
  console.log(`  Max Position: ${Utils.formatUsdc(MAX_POSITION_SIZE)} USDC`);
  console.log(`  Stop Loss: ${STOP_LOSS_PCT}%`);
  console.log(`  Max Concentration: ${MAX_PORTFOLIO_CONCENTRATION * 100}%\n`);

  // Example: Check position risk
  const market = await sdk.getMarket(marketPda);
  const examplePosition = 50_000_000; // 50 USDC

  console.log("Position Risk Assessment:");
  console.log(
    `  Position Size: ${Utils.formatUsdc(examplePosition)} USDC`
  );

  if (examplePosition > MAX_POSITION_SIZE) {
    console.log("  ⚠️  Position exceeds max size - REJECT\n");
  } else {
    console.log("  ✓ Position within size limits\n");
  }

  // Emergency Scenario
  console.log("Emergency Scenario: Halt all trading");
  console.log("Executing emergency pause...\n");

  const pauseTx = await sdk.emergencyPause(authority);
  console.log("✓ Program paused:", pauseTx);
  console.log("  All transactions will fail until unpause\n");

  // Recovery
  console.log("Recovery: Resume operations");
  const unpauseTx = await sdk.emergencyUnpause(authority);
  console.log("✓ Program unpaused:", unpauseTx);
  console.log("  Trading resumed\n");

  console.log("=== RISK MANAGEMENT COMPLETE ===\n");
}

/**
 * EXAMPLE 5: Event Monitoring
 * Shows: Subscribe to events for real-time updates
 */
async function eventMonitoring(connection: Connection, programId: PublicKey) {
  console.log("=== EVENT MONITORING EXAMPLE ===\n");

  console.log("Events to monitor:");
  console.log("  - MarketCreated");
  console.log("  - SharesBought");
  console.log("  - SharesSold");
  console.log("  - MarketResolved");
  console.log("  - WinningsRedeemed");
  console.log("  - FeesWithdrawn\n");

  console.log("Setup event listener:");
  console.log(`
    connection.onLogs(
      programId,
      (logs) => {
        // Parse and handle events
        if (logs.logs.includes('Program data: ...')) {
          // Event fired
        }
      }
    )
  \n`);

  console.log("=== EVENT MONITORING READY ===\n");
}

/**
 * EXAMPLE 6: Helper Utilities
 * Shows: Calculation helpers and formatting
 */
function utilityExamples() {
  console.log("=== UTILITY FUNCTIONS EXAMPLES ===\n");

  // USDC Formatting
  console.log("USDC Formatting:");
  console.log(
    `  Lamports 100_000_000 → ${Utils.formatUsdc(100_000_000)} USDC`
  );
  console.log(
    `  USDC 100 → ${Utils.toUsdcLamports(100)} lamports\n`
  );

  // Basis Points
  console.log("Basis Points Conversion:");
  console.log(`  100 bps → ${Utils.formatBps(100)}`);
  console.log(`  2.5% → ${Utils.parseBps(2.5)} bps\n`);

  // Market Calculations
  console.log("Market Calculations:");
  const odds1 = Utils.calculateOdds(500, 1000);
  console.log(`  Outcome Pool: 500 USDC, Total: 1000 → ${odds1.toFixed(2)}% odds`);

  const odds2 = Utils.calculateOdds(300, 1000);
  console.log(`  Outcome Pool: 300 USDC, Total: 1000 → ${odds2.toFixed(2)}% odds\n`);

  // Share Calculations
  console.log("Share Price Calculations:");
  const shares = Utils.calculateSharesReceived(100, 500, 250, 100);
  console.log(`  Buy: 100 USDC, Pool: 500, Shares: 250, Fee: 1%`);
  console.log(`  Shares Received: ${shares}\n`);

  // Redemption Calculations
  console.log("Redemption Value:");
  const redemption = Utils.calculateRedemptionValue(100, 500, 250, 100);
  console.log(`  Sell: 100 shares, Pool: 500, Shares: 250, Fee: 1%`);
  console.log(`  Redemption Value: ${Utils.formatUsdc(redemption.value)} USDC`);
  console.log(`  Fee: ${Utils.formatUsdc(redemption.fee)} USDC`);
  console.log(`  Net: ${Utils.formatUsdc(redemption.netAmount)} USDC\n`);

  // Fee Distribution
  console.log("Fee Distribution (2% fee on 1000 USDC):");
  const fees = Utils.calculateFeeDistribution(20_000_000);
  console.log(`  Creator (80%): ${Utils.formatUsdc(fees.creator)} USDC`);
  console.log(`  Invitor (10%): ${Utils.formatUsdc(fees.invitor)} USDC`);
  console.log(`  Platform (10%): ${Utils.formatUsdc(fees.platform)} USDC\n`);

  console.log("=== UTILITIES COMPLETE ===\n");
}

// Export examples for use in other modules
export {
  completeMarketLifecycle,
  tradingStrategy,
  portfolioManagement,
  riskManagement,
  eventMonitoring,
  utilityExamples,
};

// If run directly
if (require.main === module) {
  utilityExamples();
}
