use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod belief_market {
    use super::*;

    /// Initialize global program state
    pub fn initialize_global(
        ctx: Context<InitializeGlobal>,
        platform_wallet: Pubkey,
    ) -> Result<()> {
        instructions::initialize_global(ctx, platform_wallet)
    }

    /// Initialize user profile with referrer code
    pub fn initialize_user(
        ctx: Context<InitializeUser>,
        referrer_code: String,
    ) -> Result<()> {
        instructions::initialize_user(ctx, referrer_code)
    }

    /// Create a new prediction market
    pub fn create_market(
        ctx: Context<CreateMarket>,
        num_outcomes: u8,
        outcome_labels: Vec<String>,
        tags: Vec<String>,
        trading_fee_bps: u16,
        resolve_at: i64,
    ) -> Result<()> {
        instructions::create_market(
            ctx,
            num_outcomes,
            outcome_labels,
            tags,
            trading_fee_bps,
            resolve_at,
        )
    }

    /// Buy shares of an outcome
    pub fn buy_outcome(
        ctx: Context<BuyOutcome>,
        outcome_index: u8,
        amount_usdc: u64,
    ) -> Result<()> {
        instructions::buy_outcome(ctx, outcome_index, amount_usdc)
    }

    /// Sell shares of an outcome
    pub fn sell_outcome(
        ctx: Context<SellOutcome>,
        outcome_index: u8,
        shares_to_sell: u64,
    ) -> Result<()> {
        instructions::sell_outcome(ctx, outcome_index, shares_to_sell)
    }

    /// Resolve a market with the winning outcome
    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        winning_outcome: u8,
    ) -> Result<()> {
        instructions::resolve_market(ctx, winning_outcome)
    }

    /// Redeem winnings from a resolved market
    pub fn redeem_winnings(
        ctx: Context<RedeemWinnings>,
        winning_shares: u64,
    ) -> Result<()> {
        instructions::redeem_winnings(ctx, winning_shares)
    }

    /// Claim creator peg ($1 returned after resolution)
    pub fn claim_peg(ctx: Context<ClaimPeg>) -> Result<()> {
        instructions::claim_peg(ctx)
    }

    /// Withdraw accumulated trading fees
    pub fn withdraw_fees(ctx: Context<WithdrawFees>) -> Result<()> {
        instructions::withdraw_fees(ctx)
    }

    /// Emergency pause - only authority
    pub fn emergency_pause(ctx: Context<EmergencyPause>) -> Result<()> {
        instructions::emergency_pause(ctx)
    }

    /// Emergency unpause - only authority
    pub fn emergency_unpause(ctx: Context<EmergencyUnpause>) -> Result<()> {
        instructions::emergency_unpause(ctx)
    }

    /// View function: Get market odds for all outcomes
    pub fn get_market_odds(ctx: Context<GetMarketOdds>) -> Result<Vec<OutcomeOdds>> {
        instructions::get_market_odds(ctx)
    }

    /// View function: Get user position in market
    pub fn get_user_position(ctx: Context<GetUserPosition>) -> Result<UserPosition> {
        instructions::get_user_position(ctx)
    }
}

#[event]
pub struct GlobalStateInitialized {
    pub authority: Pubkey,
    pub platform_wallet: Pubkey,
}

#[event]
pub struct UserProfileInitialized {
    pub user: Pubkey,
    pub referrer_code: String,
}

#[event]
pub struct MarketCreated {
    pub market: Pubkey,
    pub creator: Pubkey,
    pub num_outcomes: u8,
    pub trading_fee_bps: u16,
    pub resolve_at: i64,
}

#[event]
pub struct SharesBought {
    pub market: Pubkey,
    pub buyer: Pubkey,
    pub outcome_index: u8,
    pub amount_paid: u64,
    pub shares_received: u64,
}

#[event]
pub struct SharesSold {
    pub market: Pubkey,
    pub seller: Pubkey,
    pub outcome_index: u8,
    pub shares_sold: u64,
    pub amount_received: u64,
}

#[event]
pub struct MarketResolved {
    pub market: Pubkey,
    pub winning_outcome: u8,
    pub resolved_at: i64,
}

#[event]
pub struct WinningsRedeemed {
    pub market: Pubkey,
    pub winner: Pubkey,
    pub amount_redeemed: u64,
}

#[event]
pub struct CreatorPegClaimed {
    pub market: Pubkey,
    pub creator: Pubkey,
    pub amount: u64,
}

#[event]
pub struct FeesWithdrawn {
    pub market: Pubkey,
    pub recipient: Pubkey,
    pub total_amount: u64,
}

#[event]
pub struct ProgramPaused {
    pub paused_at: i64,
}

#[event]
pub struct ProgramUnpaused {
    pub unpaused_at: i64,
}
