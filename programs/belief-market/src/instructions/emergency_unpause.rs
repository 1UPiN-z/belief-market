use anchor_lang::prelude::*;
use crate::state::GlobalState;

/// Event emitted when program is unpaused
#[event]
pub struct ProgramUnpaused {
    pub unpaused_at: i64,
}

/// Emergency unpause - only authority can call
pub fn emergency_unpause(ctx: Context<EmergencyUnpause>) -> Result<()> {
    require!(
        ctx.accounts.authority.key() == ctx.accounts.global_state.authority,
        crate::errors::BelievError::Unauthorized
    );

    let global_state = &mut ctx.accounts.global_state;
    global_state.paused = false;

    emit!(ProgramUnpaused {
        unpaused_at: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct EmergencyUnpause<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [crate::constants::GLOBAL_STATE_SEED],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,
}
