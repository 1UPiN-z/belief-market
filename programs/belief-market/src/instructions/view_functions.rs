use anchor_lang::prelude::*;
use crate::state::Market;

/// View function to get current odds for an outcome
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct OutcomeOdds {
    pub outcome_index: u8,
    pub odds_bps: u64, // Basis points (0-10000 = 0%-100%)
    pub outcome_label: String,
}

/// Get current market odds for all outcomes
pub fn get_market_odds(ctx: Context<GetMarketOdds>) -> Result<Vec<OutcomeOdds>> {
    let market = &ctx.accounts.market;

    let mut odds_vec = Vec::new();
    for i in 0..(market.num_outcomes as usize) {
        odds_vec.push(OutcomeOdds {
            outcome_index: i as u8,
            odds_bps: market.get_outcome_odds(i),
            outcome_label: market.outcome_labels[i].clone(),
        });
    }

    Ok(odds_vec)
}

#[derive(Accounts)]
pub struct GetMarketOdds<'info> {
    #[account(
        seeds = [crate::constants::MARKET_SEED, market.creator.as_ref(), market.resolve_at.to_le_bytes().as_ref()],
        bump = market.bump
    )]
    pub market: Account<'info, Market>,
}

/// View function to get user position in a market outcome
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UserPosition {
    pub outcome_index: u8,
    pub shares_owned: u64,
    pub current_value: u64,
}

/// Get user's current position in market
pub fn get_user_position(
    _ctx: Context<GetUserPosition>,
) -> Result<UserPosition> {
    // Note: In a real implementation, we would track user shares in separate PDAs
    // For now, this is a placeholder showing the structure
    Ok(UserPosition {
        outcome_index: 0,
        shares_owned: 0,
        current_value: 0,
    })
}

#[derive(Accounts)]
pub struct GetUserPosition<'info> {
    pub market: Account<'info, Market>,
}
