import * as anchor from "@anchor-lang/anchor";
import { Program, AnchorProvider, BN } from "@anchor-lang/anchor";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  Connection,
  Signer,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { BelievMarket } from "./types";

// Program ID - should be replaced after deployment
export const PROGRAM_ID = new PublicKey(
  "11111111111111111111111111111111"
);

// USDC Mint on Eclipse
export const USDC_MINT = new PublicKey(
  "EPjFWaLb3odcccccccccccccccccccccccccccccccc"
);

// Constants
export const GLOBAL_STATE_SEED = "global_state";
export const USER_PROFILE_SEED = "user_profile";
export const MARKET_SEED = "market";

export class BelievMarketSDK {
  private program: Program<BelievMarket>;
  private provider: AnchorProvider;

  constructor(
    provider: AnchorProvider,
    programId: PublicKey = PROGRAM_ID
  ) {
    this.provider = provider;
    // In a real implementation, we would load the IDL from a file
    const idl = null as any; // TODO: Load actual IDL
    this.program = new Program(idl, programId, provider);
  }

  /**
   * Get global state PDA
   */
  static getGlobalStatePda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_STATE_SEED)],
      PROGRAM_ID
    );
  }

  /**
   * Get user profile PDA
   */
  static getUserProfilePda(user: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(USER_PROFILE_SEED), user.toBuffer()],
      PROGRAM_ID
    );
  }

  /**
   * Get market PDA
   */
  static getMarketPda(
    creator: PublicKey,
    resolveAt: number
  ): [PublicKey, number] {
    const resolveAtBuffer = Buffer.alloc(8);
    resolveAtBuffer.writeBigInt64LE(BigInt(resolveAt), 0);
    return PublicKey.findProgramAddressSync(
      [Buffer.from(MARKET_SEED), creator.toBuffer(), resolveAtBuffer],
      PROGRAM_ID
    );
  }

  /**
   * Initialize global program state
   */
  async initializeGlobal(
    authority: Signer,
    platformWallet: PublicKey
  ): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();

    const tx = await this.program.methods
      .initializeGlobal(platformWallet)
      .accounts({
        authority: authority.publicKey,
        globalState,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    return tx;
  }

  /**
   * Initialize user profile
   */
  async initializeUser(
    user: Signer,
    referrerCode: string
  ): Promise<string> {
    const [userProfile] = BelievMarketSDK.getUserProfilePda(user.publicKey);

    const tx = await this.program.methods
      .initializeUser(referrerCode)
      .accounts({
        user: user.publicKey,
        userProfile,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    return tx;
  }

  /**
   * Create a new market
   */
  async createMarket(
    creator: Signer,
    numOutcomes: number,
    outcomeLabels: string[],
    tags: string[],
    tradingFeeBps: number,
    resolveAt: number,
    creatorTokenAccount: PublicKey,
    feeDestination: PublicKey
  ): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();
    const [userProfile] = BelievMarketSDK.getUserProfilePda(creator.publicKey);
    const [market] = BelievMarketSDK.getMarketPda(creator.publicKey, resolveAt);

    const tx = await this.program.methods
      .createMarket(
        numOutcomes,
        outcomeLabels,
        tags,
        tradingFeeBps,
        new BN(resolveAt)
      )
      .accounts({
        creator: creator.publicKey,
        creatorTokenAccount,
        feeDestination,
        globalState,
        creatorProfile: userProfile,
        market,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    return tx;
  }

  /**
   * Buy outcome shares
   */
  async buyOutcome(
    buyer: Signer,
    market: PublicKey,
    outcomeIndex: number,
    amountUsdc: number,
    buyerTokenAccount: PublicKey,
    marketTokenAccount: PublicKey
  ): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();

    const tx = await this.program.methods
      .buyOutcome(outcomeIndex, new BN(amountUsdc))
      .accounts({
        buyer: buyer.publicKey,
        buyerTokenAccount,
        marketTokenAccount,
        market,
        globalState,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([buyer])
      .rpc();

    return tx;
  }

  /**
   * Sell outcome shares
   */
  async sellOutcome(
    seller: Signer,
    market: PublicKey,
    outcomeIndex: number,
    sharesToSell: number,
    sellerTokenAccount: PublicKey,
    marketTokenAccount: PublicKey
  ): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();
    const marketVaultAuthority = market; // Same PDA acts as vault authority

    const tx = await this.program.methods
      .sellOutcome(outcomeIndex, new BN(sharesToSell))
      .accounts({
        seller: seller.publicKey,
        sellerTokenAccount,
        marketTokenAccount,
        market,
        marketVaultAuthority,
        globalState,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([seller])
      .rpc();

    return tx;
  }

  /**
   * Resolve a market
   */
  async resolveMarket(
    authority: Signer,
    market: PublicKey,
    winningOutcome: number
  ): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();

    const tx = await this.program.methods
      .resolveMarket(winningOutcome)
      .accounts({
        authority: authority.publicKey,
        market,
        globalState,
      })
      .signers([authority])
      .rpc();

    return tx;
  }

  /**
   * Redeem winnings
   */
  async redeemWinnings(
    winner: Signer,
    market: PublicKey,
    winningShares: number,
    winnerTokenAccount: PublicKey,
    marketTokenAccount: PublicKey
  ): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();
    const marketVaultAuthority = market;

    const tx = await this.program.methods
      .redeemWinnings(new BN(winningShares))
      .accounts({
        winner: winner.publicKey,
        winnerTokenAccount,
        marketTokenAccount,
        market,
        marketVaultAuthority,
        globalState,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([winner])
      .rpc();

    return tx;
  }

  /**
   * Claim creator peg
   */
  async claimPeg(
    creator: Signer,
    market: PublicKey,
    creatorTokenAccount: PublicKey,
    marketTokenAccount: PublicKey
  ): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();
    const marketVaultAuthority = market;

    const tx = await this.program.methods
      .claimPeg()
      .accounts({
        creator: creator.publicKey,
        creatorTokenAccount,
        marketTokenAccount,
        market,
        marketVaultAuthority,
        globalState,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([creator])
      .rpc();

    return tx;
  }

  /**
   * Withdraw fees
   */
  async withdrawFees(
    caller: Signer,
    market: PublicKey,
    creatorTokenAccount: PublicKey,
    invitorTokenAccount: PublicKey,
    platformTokenAccount: PublicKey,
    marketTokenAccount: PublicKey
  ): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();
    const marketVaultAuthority = market;

    const tx = await this.program.methods
      .withdrawFees()
      .accounts({
        caller: caller.publicKey,
        creatorTokenAccount,
        invitorTokenAccount,
        platformTokenAccount,
        marketTokenAccount,
        market,
        marketVaultAuthority,
        globalState,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([caller])
      .rpc();

    return tx;
  }

  /**
   * Emergency pause
   */
  async emergencyPause(authority: Signer): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();

    const tx = await this.program.methods
      .emergencyPause()
      .accounts({
        authority: authority.publicKey,
        globalState,
      })
      .signers([authority])
      .rpc();

    return tx;
  }

  /**
   * Emergency unpause
   */
  async emergencyUnpause(authority: Signer): Promise<string> {
    const [globalState] = BelievMarketSDK.getGlobalStatePda();

    const tx = await this.program.methods
      .emergencyUnpause()
      .accounts({
        authority: authority.publicKey,
        globalState,
      })
      .signers([authority])
      .rpc();

    return tx;
  }

  /**
   * Get market odds
   */
  async getMarketOdds(market: PublicKey): Promise<any> {
    const tx = await this.program.methods
      .getMarketOdds()
      .accounts({
        market,
      })
      .view();

    return tx;
  }

  /**
   * Get user position
   */
  async getUserPosition(market: PublicKey): Promise<any> {
    const tx = await this.program.methods
      .getUserPosition()
      .accounts({
        market,
      })
      .view();

    return tx;
  }

  /**
   * Fetch market data
   */
  async getMarket(marketPda: PublicKey): Promise<any> {
    return this.program.account.market.fetch(marketPda);
  }

  /**
   * Fetch user profile
   */
  async getUserProfile(userProfilePda: PublicKey): Promise<any> {
    return this.program.account.userProfile.fetch(userProfilePda);
  }

  /**
   * Fetch global state
   */
  async getGlobalState(globalStatePda: PublicKey): Promise<any> {
    return this.program.account.globalState.fetch(globalStatePda);
  }
}

export default BelievMarketSDK;
