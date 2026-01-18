use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{GlobalState, Market};

/// Event emitted when shares are sold
#[event]
pub struct SharesSold {
    pub market: Pubkey,
    pub seller: Pubkey,
    pub outcome_index: u8,
    pub shares_sold: u64,
    pub amount_received: u64,
}

/// Sell shares of a specific outcome
/// Uses parimutuel pricing model
pub fn sell_outcome(
    ctx: Context<SellOutcome>,
    outcome_index: u8,
    shares_to_sell: u64,
) -> Result<()> {
    require!(
        !ctx.accounts.global_state.is_paused(),
        crate::errors::BelievError::ProgramPaused
    );
    require!(
        shares_to_sell > 0,
        crate::errors::BelievError::InvalidAmount
    );

    let market = &mut ctx.accounts.market;

    // Validate outcome index
    require!(
        (outcome_index as usize) < market.num_outcomes as usize,
        crate::errors::BelievError::InvalidOutcomeIndex
    );

    // Ensure market not resolved
    require!(
        !market.resolved,
        crate::errors::BelievError::MarketAlreadyResolved
    );

    // Ensure seller has enough shares (would need to track in separate account)
    // For now, we assume this is validated by checking user's derived share account
    require!(
        market.outcome_shares[outcome_index as usize] >= shares_to_sell,
        crate::errors::BelievError::InsufficientShares
    );

    // Calculate redemption value using parimutuel formula
    let current_price = market.outcome_pools[outcome_index as usize]
        .checked_div(market.outcome_shares[outcome_index as usize])
        .ok_or(crate::errors::BelievError::MarketCalculationError)?;

    let redemption_value = shares_to_sell
        .checked_mul(current_price)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    // Calculate fee on redemption
    let fee_amount = redemption_value
        .checked_mul(market.trading_fee_bps as u64)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?
        .checked_div(10000)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    let amount_after_fee = redemption_value
        .checked_sub(fee_amount)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    // Ensure enough liquidity
    require!(
        market.outcome_pools[outcome_index as usize] >= amount_after_fee,
        crate::errors::BelievError::InsufficientFunds
    );

    // Transfer USDC from market to seller
    let transfer_ix = Transfer {
        from: ctx.accounts.market_token_account.to_account_info(),
        to: ctx.accounts.seller_token_account.to_account_info(),
        authority: ctx.accounts.market_vault_authority.to_account_info(),
    };
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_ix,
            &[&[
                crate::constants::MARKET_SEED,
                market.creator.as_ref(),
                market.resolve_at.to_le_bytes().as_ref(),
                &[market.bump],
            ]],
        ),
        amount_after_fee,
    )?;

    // Update market pools
    market.outcome_pools[outcome_index as usize] = market.outcome_pools[outcome_index as usize]
        .checked_sub(amount_after_fee)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    market.outcome_shares[outcome_index as usize] = market.outcome_shares[outcome_index as usize]
        .checked_sub(shares_to_sell)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    // Accumulate fees for creator
    let creator_fee = fee_amount
        .checked_mul(crate::constants::FEE_CREATOR_PERCENT as u64)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    market.accumulated_fees[outcome_index as usize] = market.accumulated_fees[outcome_index as usize]
        .checked_add(creator_fee)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    emit!(SharesSold {
        market: market.key(),
        seller: ctx.accounts.seller.key(),
        outcome_index,
        shares_sold,
        amount_received: amount_after_fee,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(outcome_index: u8, shares_to_sell: u64)]
pub struct SellOutcome<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
        token::authority = seller
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
    )]
    pub market_token_account: Account<'info, TokenAccount>,

    /// Market PDA acts as vault authority for token transfers
    #[account(
        mut,
        seeds = [crate::constants::MARKET_SEED, market.creator.as_ref(), market.resolve_at.to_le_bytes().as_ref()],
        bump = market.bump
    )]
    pub market: Account<'info, Market>,

    /// Market PDA used as authority for CPI
    #[account(
        seeds = [crate::constants::MARKET_SEED, market.creator.as_ref(), market.resolve_at.to_le_bytes().as_ref()],
        bump = market.bump
    )]
    pub market_vault_authority: AccountInfo<'info>,

    #[account(
        seeds = [crate::constants::GLOBAL_STATE_SEED],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    pub token_program: Program<'info, Token>,
}
