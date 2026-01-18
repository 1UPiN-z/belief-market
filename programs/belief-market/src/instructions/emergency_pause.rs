use anchor_lang::prelude::*;
use crate::state::GlobalState;

/// Event emitted when program is paused
#[event]
pub struct ProgramPaused {
    pub paused_at: i64,
}

/// Emergency pause - only authority can call
pub fn emergency_pause(ctx: Context<EmergencyPause>) -> Result<()> {
    require!(
        ctx.accounts.authority.key() == ctx.accounts.global_state.authority,
        crate::errors::BelievError::Unauthorized
    );

    let global_state = &mut ctx.accounts.global_state;
    global_state.paused = true;

    emit!(ProgramPaused {
        paused_at: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [crate::constants::GLOBAL_STATE_SEED],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,
}
