use anchor_lang::prelude::*;
use crate::state::UserProfile;

/// Event emitted when a user profile is initialized
#[event]
pub struct UserProfileInitialized {
    pub user: Pubkey,
    pub referrer_code: String,
}

/// Initialize a user profile
/// Called once per user to set up their referrer code
pub fn initialize_user(
    ctx: Context<InitializeUser>,
    referrer_code: String,
) -> Result<()> {
    require!(
        referrer_code.len() <= UserProfile::MAX_REFERRER_CODE_LEN,
        crate::errors::BelievError::StringTooLong
    );
    require!(
        !referrer_code.is_empty(),
        crate::errors::BelievError::ReferrerCodeInvalid
    );

    let user_profile = &mut ctx.accounts.user_profile;
    
    user_profile.owner = ctx.accounts.user.key();
    user_profile.invitor = None;
    user_profile.referrer_code = referrer_code.clone();
    user_profile.bump = ctx.bumps.user_profile;

    emit!(UserProfileInitialized {
        user: user_profile.owner,
        referrer_code,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(referrer_code: String)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = UserProfile::LEN,
        seeds = [crate::constants::USER_PROFILE_SEED, user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    pub system_program: Program<'info, System>,
}
