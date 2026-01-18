import { PublicKey, Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { USDC_MINT } from "./lib";

/**
 * Eclipse SVM RPC endpoints
 */
export const ECLIPSE_ENDPOINTS = {
  devnet: "https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY",
  mainnet: "https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY",
};

/**
 * Get or create token account for a user
 */
export async function getOrCreateTokenAccount(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  payer: Keypair
): Promise<PublicKey> {
  const ata = getAssociatedTokenAddressSync(mint, owner);

  const accountInfo = await connection.getAccountInfo(ata);
  if (accountInfo) {
    return ata;
  }

  // Create ATA
  const account = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner
  );

  return account.address;
}

/**
 * Format USDC amount from lamports to readable format
 */
export function formatUsdc(lamports: number): number {
  return lamports / 1_000_000; // USDC has 6 decimals
}

/**
 * Convert USDC amount to lamports
 */
export function toUsdcLamports(amount: number): number {
  return amount * 1_000_000; // USDC has 6 decimals
}

/**
 * Format basis points to percentage
 */
export function formatBps(bps: number): string {
  return (bps / 100).toFixed(2) + "%";
}

/**
 * Parse basis points from percentage
 */
export function parseBps(percentage: number): number {
  return Math.floor(percentage * 100);
}

/**
 * Validate market parameters
 */
export function validateMarketParams(
  numOutcomes: number,
  outcomeLabels: string[],
  tradingFeeBps: number,
  resolveAt: number
): string[] {
  const errors: string[] = [];

  if (numOutcomes < 2 || numOutcomes > 10) {
    errors.push("Number of outcomes must be between 2 and 10");
  }

  if (outcomeLabels.length !== numOutcomes) {
    errors.push("Number of outcome labels must match number of outcomes");
  }

  for (let i = 0; i < outcomeLabels.length; i++) {
    if (outcomeLabels[i].length > 20) {
      errors.push(`Outcome label ${i} is too long (max 20 characters)`);
    }
  }

  if (tradingFeeBps < 1 || tradingFeeBps > 500) {
    errors.push("Trading fee must be between 1 and 500 basis points");
  }

  const now = Math.floor(Date.now() / 1000);
  if (resolveAt <= now + 60) {
    errors.push("Resolution time must be at least 1 minute in the future");
  }

  if (resolveAt > now + 315_360_000) {
    errors.push("Resolution time must be within 10 years");
  }

  return errors;
}

/**
 * Calculate parimutuel odds
 */
export function calculateOdds(
  outcomePool: number,
  totalPool: number
): number {
  if (totalPool === 0) return 0;
  return (outcomePool / totalPool) * 100;
}

/**
 * Calculate shares received for a purchase
 */
export function calculateSharesReceived(
  amountUsdc: number,
  outcomePool: number,
  outcomeShares: number,
  tradingFeeBps: number
): number {
  const feeAmount = Math.floor((amountUsdc * tradingFeeBps) / 10000);
  const amountAfterFee = amountUsdc - feeAmount;

  if (outcomeShares === 0) {
    return amountAfterFee;
  }

  const currentPrice = Math.floor(outcomePool / outcomeShares);
  return Math.floor(amountAfterFee / currentPrice);
}

/**
 * Calculate redemption value for a sale
 */
export function calculateRedemptionValue(
  sharesToSell: number,
  outcomePool: number,
  outcomeShares: number,
  tradingFeeBps: number
): { value: number; fee: number; netAmount: number } {
  const currentPrice = Math.floor(outcomePool / outcomeShares);
  const redemptionValue = sharesToSell * currentPrice;
  const fee = Math.floor((redemptionValue * tradingFeeBps) / 10000);
  const netAmount = redemptionValue - fee;

  return { value: redemptionValue, fee, netAmount };
}

/**
 * Calculate winnings for a winner
 */
export function calculateWinnings(
  winningShares: number,
  totalPool: number,
  totalWinningShares: number
): number {
  if (totalWinningShares === 0) return 0;
  const redemptionPerShare = Math.floor(totalPool / totalWinningShares);
  return winningShares * redemptionPerShare;
}

/**
 * Calculate fee distribution
 */
export function calculateFeeDistribution(
  totalFees: number
): { creator: number; invitor: number; platform: number } {
  const creator = Math.floor((totalFees * 80) / 100);
  const invitor = Math.floor((totalFees * 10) / 100);
  const platform = totalFees - creator - invitor;

  return { creator, invitor, platform };
}

/**
 * Sleep utility for testing
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get connection to Eclipse
 */
export function getConnection(endpoint: string): Connection {
  return new Connection(endpoint, "confirmed");
}

export default {
  getOrCreateTokenAccount,
  formatUsdc,
  toUsdcLamports,
  formatBps,
  parseBps,
  validateMarketParams,
  calculateOdds,
  calculateSharesReceived,
  calculateRedemptionValue,
  calculateWinnings,
  calculateFeeDistribution,
  sleep,
  getConnection,
  ECLIPSE_ENDPOINTS,
};
