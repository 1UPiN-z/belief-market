use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{GlobalState, Market};

/// Event emitted when a user redeems winnings
#[event]
pub struct WinningsRedeemed {
    pub market: Pubkey,
    pub winner: Pubkey,
    pub amount_redeemed: u64,
}

/// Redeem winnings for resolved markets
/// User must have shares in the winning outcome
pub fn redeem_winnings(
    ctx: Context<RedeemWinnings>,
    winning_shares: u64,
) -> Result<()> {
    require!(
        !ctx.accounts.global_state.is_paused(),
        crate::errors::BelievError::ProgramPaused
    );

    let market = &mut ctx.accounts.market;

    // Ensure market is resolved
    require!(
        market.resolved,
        crate::errors::BelievError::MarketNotResolved
    );

    let winning_outcome = market.winning_outcome
        .ok_or(crate::errors::BelievError::InvalidMarketState)?;

    require!(
        winning_shares > 0,
        crate::errors::BelievError::InvalidAmount
    );

    // Calculate redemption value: shares * (total_pool / total_winning_shares)
    // This ensures: money_in = money_out at all times
    let redemption_per_share = market.total_pool()
        .checked_div(market.outcome_shares[winning_outcome as usize])
        .ok_or(crate::errors::BelievError::MarketCalculationError)?;

    let amount_to_redeem = winning_shares
        .checked_mul(redemption_per_share)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    require!(
        amount_to_redeem > 0,
        crate::errors::BelievError::NoWinningsToRedeem
    );

    // Transfer from market vault to winner
    let transfer_ix = Transfer {
        from: ctx.accounts.market_token_account.to_account_info(),
        to: ctx.accounts.winner_token_account.to_account_info(),
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
        amount_to_redeem,
    )?;

    // Reduce outcome shares and pools
    market.outcome_shares[winning_outcome as usize] = market.outcome_shares[winning_outcome as usize]
        .checked_sub(winning_shares)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    market.outcome_pools[winning_outcome as usize] = market.outcome_pools[winning_outcome as usize]
        .checked_sub(amount_to_redeem)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    emit!(WinningsRedeemed {
        market: market.key(),
        winner: ctx.accounts.winner.key(),
        amount_redeemed,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(winning_shares: u64)]
pub struct RedeemWinnings<'info> {
    pub winner: Signer<'info>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
        token::authority = winner
    )]
    pub winner_token_account: Account<'info, TokenAccount>,

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
