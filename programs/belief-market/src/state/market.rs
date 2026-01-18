use anchor_lang::prelude::*;

/// Represents a single prediction market
#[account]
pub struct Market {
    /// Market creator
    pub creator: Pubkey,
    /// User who invited the creator
    pub invitor: Option<Pubkey>,
    /// User who referred the creator
    pub referrer: Option<Pubkey>,
    /// Number of outcomes (2-10)
    pub num_outcomes: u8,
    /// Labels for each outcome (max 20 chars each)
    pub outcome_labels: Vec<String>,
    /// Total amount wagered on each outcome (in lamports)
    pub outcome_pools: Vec<u64>,
    /// Number of shares issued for each outcome
    pub outcome_shares: Vec<u64>,
    /// Market tags for filtering
    pub tags: Vec<String>,
    /// Trading fee in basis points (1-500)
    pub trading_fee_bps: u16,
    /// Timestamp when market resolves
    pub resolve_at: i64,
    /// Whether market has been resolved
    pub resolved: bool,
    /// Winning outcome index (only set after resolution)
    pub winning_outcome: Option<u8>,
    /// Creator peg amount (1 USDC in lamports)
    pub creator_peg_amount: u64,
    /// Whether creator has claimed their peg
    pub creator_peg_claimed: bool,
    /// Accumulated fees per outcome (not yet withdrawn)
    pub accumulated_fees: Vec<u64>,
    /// Market creation timestamp
    pub created_at: i64,
    /// Bump seed for PDA derivation
    pub bump: u8,
}

impl Market {
    pub const MAX_OUTCOMES: u8 = 10;
    pub const MIN_OUTCOMES: u8 = 2;
    pub const MAX_OUTCOME_LABEL_LEN: usize = 20;
    pub const MAX_TAGS: usize = 5;
    pub const MAX_TAG_LEN: usize = 15;

    /// Calculate the current odds for a specific outcome (in basis points, 0-10000 = 0%-100%)
    pub fn get_outcome_odds(&self, outcome_idx: usize) -> u64 {
        if self.outcome_pools.is_empty() {
            return 0;
        }
        let total_pool: u64 = self.outcome_pools.iter().sum();
        if total_pool == 0 {
            return 10000 / self.outcome_pools.len() as u64;
        }
        (self.outcome_pools[outcome_idx] as u128 * 10000 as u128 / total_pool as u128) as u64
    }

    /// Get total amount in all outcome pools
    pub fn total_pool(&self) -> u64 {
        self.outcome_pools.iter().sum()
    }

    /// Validate market state
    pub fn validate(&self) -> Result<()> {
        require!(
            self.num_outcomes >= Self::MIN_OUTCOMES && self.num_outcomes <= Self::MAX_OUTCOMES,
            crate::errors::BelievError::InvalidOutcomeCount
        );
        require!(
            self.outcome_labels.len() == self.num_outcomes as usize,
            crate::errors::BelievError::OutcomeCountMismatch
        );
        require!(
            self.outcome_pools.len() == self.num_outcomes as usize,
            crate::errors::BelievError::OutcomeCountMismatch
        );
        require!(
            self.trading_fee_bps <= 500,
            crate::errors::BelievError::InvalidTradingFee
        );
        Ok(())
    }
}
