use anchor_lang::prelude::*;

/// User profile tracking invitor and referrer relationships
#[account]
pub struct UserProfile {
    /// User's public key
    pub owner: Pubkey,
    /// One-time binding to invitor (cannot be changed)
    pub invitor: Option<Pubkey>,
    /// Referrer code given to others (user sets their own referrer code)
    pub referrer_code: String,
    /// Bump seed for PDA derivation
    pub bump: u8,
}

impl UserProfile {
    pub const MAX_REFERRER_CODE_LEN: usize = 20;
    pub const LEN: usize = 8 + 32 + (1 + 32) + 4 + Self::MAX_REFERRER_CODE_LEN + 1;

    pub fn get_invitor(&self) -> Option<Pubkey> {
        self.invitor
    }

    pub fn has_invitor(&self) -> bool {
        self.invitor.is_some()
    }
}
