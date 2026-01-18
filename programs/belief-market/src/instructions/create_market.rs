use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{GlobalState, UserProfile, Market};

/// Event emitted when a market is created
#[event]
pub struct MarketCreated {
    pub market: Pubkey,
    pub creator: Pubkey,
    pub num_outcomes: u8,
    pub trading_fee_bps: u16,
    pub resolve_at: i64,
}

/// Create a new prediction market
/// Requires 5 USDC: $2 platform, $1.80 invitor, $0.20 referrer, $1 creator peg
pub fn create_market(
    ctx: Context<CreateMarket>,
    num_outcomes: u8,
    outcome_labels: Vec<String>,
    tags: Vec<String>,
    trading_fee_bps: u16,
    resolve_at: i64,
) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;

    // Validate inputs
    require!(
        num_outcomes >= Market::MIN_OUTCOMES && num_outcomes <= Market::MAX_OUTCOMES,
        crate::errors::BelievError::InvalidOutcomeCount
    );
    require!(
        outcome_labels.len() == num_outcomes as usize,
        crate::errors::BelievError::OutcomeCountMismatch
    );
    require!(
        trading_fee_bps >= crate::constants::MIN_TRADING_FEE_BPS 
            && trading_fee_bps <= crate::constants::MAX_TRADING_FEE_BPS,
        crate::errors::BelievError::InvalidTradingFee
    );
    require!(
        resolve_at > now + crate::constants::MIN_RESOLUTION_TIME_SECS
            && resolve_at < now + crate::constants::MAX_RESOLUTION_TIME_SECS,
        crate::errors::BelievError::InvalidResolutionTime
    );
    require!(
        tags.len() <= Market::MAX_TAGS,
        crate::errors::BelievError::StringTooLong
    );

    for label in &outcome_labels {
        require!(
            label.len() <= Market::MAX_OUTCOME_LABEL_LEN,
            crate::errors::BelievError::StringTooLong
        );
    }

    for tag in &tags {
        require!(
            tag.len() <= Market::MAX_TAG_LEN,
            crate::errors::BelievError::StringTooLong
        );
    }

    // Check program not paused
    require!(
        !ctx.accounts.global_state.is_paused(),
        crate::errors::BelievError::ProgramPaused
    );

    // Transfer 5 USDC creation fee from creator
    let transfer_ix = Transfer {
        from: ctx.accounts.creator_token_account.to_account_info(),
        to: ctx.accounts.fee_destination.to_account_info(),
        authority: ctx.accounts.creator.to_account_info(),
    };
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_ix,
        ),
        crate::constants::MARKET_CREATION_FEE_USDC,
    )?;

    // Initialize market
    let market = &mut ctx.accounts.market;
    market.creator = ctx.accounts.creator.key();
    market.invitor = ctx.accounts.creator_profile.invitor;
    market.referrer = None; // Referrers only earn from creation via fee split
    market.num_outcomes = num_outcomes;
    market.outcome_labels = outcome_labels;
    market.outcome_pools = vec![0; num_outcomes as usize];
    market.outcome_shares = vec![0; num_outcomes as usize];
    market.tags = tags;
    market.trading_fee_bps = trading_fee_bps;
    market.resolve_at = resolve_at;
    market.resolved = false;
    market.winning_outcome = None;
    market.creator_peg_amount = crate::constants::MARKET_FEE_CREATOR_PEG;
    market.creator_peg_claimed = false;
    market.accumulated_fees = vec![0; num_outcomes as usize];
    market.created_at = now;
    market.bump = ctx.bumps.market;

    emit!(MarketCreated {
        market: market.key(),
        creator: market.creator,
        num_outcomes,
        trading_fee_bps,
        resolve_at,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    num_outcomes: u8,
    outcome_labels: Vec<String>,
    tags: Vec<String>,
    trading_fee_bps: u16,
    resolve_at: i64,
)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
        token::authority = creator
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
        token::authority = global_state.platform_wallet
    )]
    pub fee_destination: Account<'info, TokenAccount>,

    #[account(
        seeds = [crate::constants::GLOBAL_STATE_SEED],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        seeds = [crate::constants::USER_PROFILE_SEED, creator.key().as_ref()],
        bump = creator_profile.bump
    )]
    pub creator_profile: Account<'info, UserProfile>,

    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 1 + 32 + (1 + 32) + (1 + 32) + 1 + 
                4 + 100 + 4 + 80 + 4 + 80 + 4 + 75 + 
                2 + 8 + 1 + (1 + 1) + 8 + 1 + 4 + 80 + 8,
        seeds = [crate::constants::MARKET_SEED, creator.key().as_ref(), resolve_at.to_le_bytes().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
