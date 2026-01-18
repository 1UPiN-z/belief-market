use anchor_lang::prelude::*;
use crate::state::{GlobalState, Market};

/// Event emitted when a market is resolved
#[event]
pub struct MarketResolved {
    pub market: Pubkey,
    pub winning_outcome: u8,
    pub resolved_at: i64,
}

/// Resolve a market by setting the winning outcome
/// Only authority can call this
pub fn resolve_market(
    ctx: Context<ResolveMarket>,
    winning_outcome: u8,
) -> Result<()> {
    let market = &mut ctx.accounts.market;

    // Validate authority
    require!(
        ctx.accounts.authority.key() == ctx.accounts.global_state.authority,
        crate::errors::BelievError::Unauthorized
    );

    // Validate outcome index
    require!(
        (winning_outcome as usize) < market.num_outcomes as usize,
        crate::errors::BelievError::InvalidOutcomeIndex
    );

    // Check resolution time has passed
    let now = Clock::get()?.unix_timestamp;
    require!(
        now >= market.resolve_at,
        crate::errors::BelievError::ResolutionTimeNotReached
    );

    // Ensure not already resolved
    require!(
        !market.resolved,
        crate::errors::BelievError::MarketAlreadyResolved
    );

    market.resolved = true;
    market.winning_outcome = Some(winning_outcome);

    emit!(MarketResolved {
        market: market.key(),
        winning_outcome,
        resolved_at: now,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(winning_outcome: u8)]
pub struct ResolveMarket<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [crate::constants::MARKET_SEED, market.creator.as_ref(), market.resolve_at.to_le_bytes().as_ref()],
        bump = market.bump
    )]
    pub market: Account<'info, Market>,

    #[account(
        seeds = [crate::constants::GLOBAL_STATE_SEED],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,
}
