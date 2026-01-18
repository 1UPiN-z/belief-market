use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{GlobalState, Market, UserProfile};

/// Event emitted when fees are withdrawn
#[event]
pub struct FeesWithdrawn {
    pub market: Pubkey,
    pub recipient: Pubkey,
    pub total_amount: u64,
}

/// Withdraw accumulated trading fees
/// Distributes fees: 80% to creator, 10% to invitor, 10% to platform
pub fn withdraw_fees(
    ctx: Context<WithdrawFees>,
) -> Result<()> {
    require!(
        !ctx.accounts.global_state.is_paused(),
        crate::errors::BelievError::ProgramPaused
    );

    let market = &mut ctx.accounts.market;

    // Ensure market is resolved
    require!(
        market.resolved,
        crate::errors::BelievError::CannotWithdrawUnresolved
    );

    let total_fees: u64 = market.accumulated_fees.iter().sum();
    require!(
        total_fees > 0,
        crate::errors::BelievError::NoFeesToWithdraw
    );

    // Calculate fee distribution: 80% creator, 10% invitor, 10% platform
    let creator_share = total_fees
        .checked_mul(crate::constants::FEE_CREATOR_PERCENT as u64)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    let invitor_share = total_fees
        .checked_mul(crate::constants::FEE_INVITOR_PERCENT as u64)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    let platform_share = total_fees
        .checked_sub(creator_share)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?
        .checked_sub(invitor_share)
        .ok_or(crate::errors::BelievError::ArithmeticOverflow)?;

    // Transfer creator share
    if creator_share > 0 {
        let transfer_ix = Transfer {
            from: ctx.accounts.market_token_account.to_account_info(),
            to: ctx.accounts.creator_token_account.to_account_info(),
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
            creator_share,
        )?;
    }

    // Transfer invitor share if invitor exists
    if let Some(invitor) = market.invitor {
        if invitor_share > 0 {
            let transfer_ix = Transfer {
                from: ctx.accounts.market_token_account.to_account_info(),
                to: ctx.accounts.invitor_token_account.to_account_info(),
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
                invitor_share,
            )?;
        }
    }

    // Transfer platform share
    if platform_share > 0 {
        let transfer_ix = Transfer {
            from: ctx.accounts.market_token_account.to_account_info(),
            to: ctx.accounts.platform_token_account.to_account_info(),
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
            platform_share,
        )?;
    }

    // Clear accumulated fees
    market.accumulated_fees = vec![0; market.num_outcomes as usize];

    emit!(FeesWithdrawn {
        market: market.key(),
        recipient: ctx.accounts.caller.key(),
        total_amount: total_fees,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFees<'info> {
    pub caller: Signer<'info>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
        token::authority = market.creator
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
    )]
    pub invitor_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = crate::constants::USDC_MINT,
        token::authority = global_state.platform_wallet
    )]
    pub platform_token_account: Account<'info, TokenAccount>,

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
