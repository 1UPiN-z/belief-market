/// Program constants and configuration values

/// Authority that can initialize global state
/// This should be replaced with actual authority during deployment
pub const PROGRAM_AUTHORITY: &str = "11111111111111111111111111111111";

/// USDC mint address on Eclipse (6 decimal places)
pub const USDC_MINT: &str = "EPjFWaLb3odcccccccccccccccccccccccccccccccc";

/// USDC decimals
pub const USDC_DECIMALS: u8 = 6;

/// Platform wallet to collect fees
/// This should be replaced during deployment
pub const PLATFORM_WALLET: &str = "11111111111111111111111111111111";

/// Market creation fee in USDC (5 USDC)
pub const MARKET_CREATION_FEE_USDC: u64 = 5_000_000; // 5 USDC in lamports

/// Market creation fee breakdown (must sum to MARKET_CREATION_FEE_USDC)
pub const MARKET_FEE_PLATFORM_SHARE: u64 = 2_000_000; // $2
pub const MARKET_FEE_INVITOR_SHARE: u64 = 1_800_000; // $1.80
pub const MARKET_FEE_REFERRER_SHARE: u64 = 200_000; // $0.20
pub const MARKET_FEE_CREATOR_PEG: u64 = 1_000_000; // $1 peg

/// Trading fee distribution
/// Fees are: 80% creator, 10% invitor, 10% platform
pub const FEE_CREATOR_PERCENT: u16 = 80; // 80%
pub const FEE_INVITOR_PERCENT: u16 = 10; // 10%
pub const FEE_PLATFORM_PERCENT: u16 = 10; // 10%

/// PDA seeds for account derivation
pub const GLOBAL_STATE_SEED: &[u8] = b"global_state";
pub const USER_PROFILE_SEED: &[u8] = b"user_profile";
pub const MARKET_SEED: &[u8] = b"market";

/// Minimum and maximum outcomes per market
pub const MIN_OUTCOMES: u8 = 2;
pub const MAX_OUTCOMES: u8 = 10;

/// Minimum and maximum trading fee (in basis points)
pub const MIN_TRADING_FEE_BPS: u16 = 1; // 0.01%
pub const MAX_TRADING_FEE_BPS: u16 = 500; // 5%

/// Maximum string lengths
pub const MAX_OUTCOME_LABEL_LEN: usize = 20;
pub const MAX_REFERRER_CODE_LEN: usize = 20;
pub const MAX_TAG_LEN: usize = 15;
pub const MAX_TAGS_PER_MARKET: usize = 5;

/// Minimum resolution time (1 minute from now)
pub const MIN_RESOLUTION_TIME_SECS: i64 = 60;

/// Maximum resolution time (10 years from now)
pub const MAX_RESOLUTION_TIME_SECS: i64 = 315_360_000;
