use anchor_lang::prelude::*;
use crate::state::GlobalState;

/// Event emitted when global state is initialized
#[event]
pub struct GlobalStateInitialized {
    pub authority: Pubkey,
    pub platform_wallet: Pubkey,
}

/// Initialize the global program state
/// Only called once by the program authority
pub fn initialize_global(
    ctx: Context<InitializeGlobal>,
    platform_wallet: Pubkey,
) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    
    global_state.authority = ctx.accounts.authority.key();
    global_state.platform_wallet = platform_wallet;
    global_state.paused = false;
    global_state.bump = ctx.bumps.global_state;

    emit!(GlobalStateInitialized {
        authority: global_state.authority,
        platform_wallet: global_state.platform_wallet,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct InitializeGlobal<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = GlobalState::LEN,
        seeds = [crate::constants::GLOBAL_STATE_SEED],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,

    pub system_program: Program<'info, System>,
}
