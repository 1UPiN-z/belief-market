use anchor_lang::prelude::*;
use spl_token::instruction::AuthorityType;

/// Global program state and configuration
#[account]
pub struct GlobalState {
    /// Program authority that can pause/unpause
    pub authority: Pubkey,
    /// Wallet to collect platform fees
    pub platform_wallet: Pubkey,
    /// Whether the program is paused
    pub paused: bool,
    /// Bump seed for PDA derivation
    pub bump: u8,
}

impl GlobalState {
    pub const LEN: usize = 8 + 32 + 32 + 1 + 1;

    pub fn is_paused(&self) -> bool {
        self.paused
    }
}
