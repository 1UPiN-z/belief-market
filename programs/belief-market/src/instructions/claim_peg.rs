use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{GlobalState, Market};

/// Event emitted when creator claims their peg
#[event]
pub struct CreatorPegClaimed {
    pub market: Pubkey,
    pub creator: Pubkey,
    pub amount: u64,
}

/// Claim creator peg ($1 USDC returned after resolution)
pub fn claim_peg(ctx: Context<ClaimPeg>) -> Result<()> {
    require!(
        !ctx.accounts.global_state.is_paused(),
        crate::errors::BelievError::ProgramPaused
    );

    let market = &mut ctx.accounts.market;

    // Verify caller is creator
    require!(
        ctx.accounts.creator.key() == market.creator,
        crate::errors::BelievError::UserNotAuthorized
    );

    // Ensure market is resolved
    require!(
        market.resolved,
        crate::errors::BelievError::MarketNotResolved
    );

    // Ensure peg not already claimed
    require!(
        !market.creator_peg_claimed,
        crate::errors::BelievError::CreatorPegAlreadyClaimed
    );

    let peg_amount = market.creator_peg_amount;
    require!(
        peg_amount > 0,
        crate::errors::BelievError::InvalidAmount
    );

    // Transfer from market vault to creator
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
        peg_amount,
    )?;

    market.creator_peg_claimed = true;

    emit!(CreatorPegClaimed {
        market: market.key(),
        creator: market.creator,
        amount: peg_amount,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct ClaimPeg<'info> {
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
