use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{GlobalState, Market};

/// Event emitted when shares are bought
#[event]
pub struct SharesBought {
    pub market: Pubkey,
    pub buyer: Pubkey,
    pub outcome_index: u8,
    pub amount_paid: u64,
    pub shares_received: u64,
}

/// Buy shares of a specific outcome
/// Uses parimutuel pricing model
pub fn buy_outcome(
    ctx: Context<BuyOutcome>,
    outcome_index: u8,
    amount_usdc: u64,
) -> Result<()> {
    require!(
        !ctx.accounts.global_state.is_paused(),
        crate::errors::BelievError::ProgramPaused
    );
    require!(
        amount_usdc > 0,
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

    // Calculate fee
    let fee_amount = amount_usdc
        .checked_mul(market.trading_fee_bps as u64)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?
        .checked_div(10000)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    let amount_after_fee = amount_usdc
        .checked_sub(fee_amount)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    // Parimutuel model: shares = amount_after_fee / current_price
    // Current price for an outcome is: outcome_pool / outcome_shares (if shares > 0, else 1)
    let shares_to_issue = if market.outcome_shares[outcome_index as usize] == 0 {
        // First buyer: 1 share per lamport
        amount_after_fee
    } else {
        let current_price = market.outcome_pools[outcome_index as usize]
            .checked_div(market.outcome_shares[outcome_index as usize])
            .ok_or(crate::errors::BelievError::MarketCalculationError)?;
        
        amount_after_fee
            .checked_div(current_price)
            .ok_or(crate::errors::BelievError::ArithmeticOverflow)?
    };

    require!(
        shares_to_issue > 0,
        crate::errors::BelievError::InvalidAmount
    );

    // Transfer USDC from buyer to market vault
    let transfer_ix = Transfer {
        from: ctx.accounts.buyer_token_account.to_account_info(),
        to: ctx.accounts.market_token_account.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_ix,
        ),
        amount_usdc,
    )?;

    // Update market pools
    market.outcome_pools[outcome_index as usize] = market.outcome_pools[outcome_index as usize]
        .checked_add(amount_after_fee)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    market.outcome_shares[outcome_index as usize] = market.outcome_shares[outcome_index as usize]
        .checked_add(shares_to_issue)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    // Distribute fees: 80% creator, 10% invitor, 10% platform
    let creator_fee = fee_amount
        .checked_mul(crate::constants::FEE_CREATOR_PERCENT as u64)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    market.accumulated_fees[outcome_index as usize] = market.accumulated_fees[outcome_index as usize]
        .checked_add(creator_fee)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    emit!(SharesBought {
        market: market.key(),
        buyer: ctx.accounts.buyer.key(),
        outcome_index,
        amount_paid: amount_usdc,
        shares_received: shares_to_issue,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(outcome_index: u8, amount_usdc: u64)]
pub struct BuyOutcome<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
        token::authority = buyer
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
    )]
    pub market_token_account: Account<'info, TokenAccount>,

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

    pub token_program: Program<'info, Token>,
}
