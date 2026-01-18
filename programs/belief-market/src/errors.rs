use anchor_lang::prelude::*;

/// Custom error codes for the Belief Market program
#[error_code]
pub enum BelievError {
    #[msg("Program is currently paused")]
    ProgramPaused = 0,

    #[msg("Unauthorized: only authority can perform this action")]
    Unauthorized = 1,

    #[msg("Invalid outcome count (must be 2-10)")]
    InvalidOutcomeCount = 2,

    #[msg("Outcome count mismatch between labels and pools")]
    OutcomeCountMismatch = 3,

    #[msg("Invalid trading fee (must be 1-500 bps)")]
    InvalidTradingFee = 4,

    #[msg("Invalid outcome index")]
    InvalidOutcomeIndex = 5,

    #[msg("Market not resolved yet")]
    MarketNotResolved = 6,

    #[msg("Market already resolved")]
    MarketAlreadyResolved = 7,

    #[msg("Invalid resolution time")]
    InvalidResolutionTime = 8,

    #[msg("Insufficient funds")]
    InsufficientFunds = 9,

    #[msg("Arithmetic overflow")]
    ArithmeticOverflow = 10,

    #[msg("Invalid amount")]
    InvalidAmount = 11,

    #[msg("User has not initialized their profile")]
    UserProfileNotInitialized = 12,

    #[msg("Invitor already set for this user")]
    InvitorAlreadySet = 13,

    #[msg("Cannot invite yourself")]
    CannotInviteYourself = 14,

    #[msg("Creator peg already claimed")]
    CreatorPegAlreadyClaimed = 15,

    #[msg("No winnings to redeem")]
    NoWinningsToRedeem = 16,

    #[msg("No fees to withdraw")]
    NoFeesToWithdraw = 17,

    #[msg("Invalid token mint")]
    InvalidTokenMint = 18,

    #[msg("Token account must be owned by user")]
    TokenAccountNotOwnedByUser = 19,

    #[msg("Insufficient shares to sell")]
    InsufficientShares = 20,

    #[msg("Market resolution time not reached")]
    ResolutionTimeNotReached = 21,

    #[msg("String too long")]
    StringTooLong = 22,

    #[msg("Referrer code invalid")]
    ReferrerCodeInvalid = 23,

    #[msg("User not authorized")]
    UserNotAuthorized = 24,

    #[msg("Cannot withdraw from unresolved market")]
    CannotWithdrawUnresolved = 25,

    #[msg("Max outcomes exceeded")]
    MaxOutcomesExceeded = 26,

    #[msg("Min outcomes not met")]
    MinOutcomesNotMet = 27,

    #[msg("Referrer code already in use")]
    ReferrerCodeInUse = 28,

    #[msg("Invalid market state")]
    InvalidMarketState = 29,

    #[msg("Fees already claimed")]
    FeesAlreadyClaimed = 30,

    #[msg("Market calculation error")]
    MarketCalculationError = 31,
}
