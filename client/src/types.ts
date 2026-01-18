export type BelievMarket = {
  version: "0.1.0";
  name: "belief_market";
  instructions: [
    {
      name: "initializeGlobal";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "platformWallet";
          type: "publicKey";
        }
      ];
    },
    {
      name: "initializeUser";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userProfile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "referrerCode";
          type: "string";
        }
      ];
    },
    {
      name: "createMarket";
      accounts: [
        {
          name: "creator";
          isMut: true;
          isSigner: true;
        },
        {
          name: "creatorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "feeDestination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalState";
          isMut: false;
          isSigner: false;
        },
        {
          name: "creatorProfile";
          isMut: false;
          isSigner: false;
        },
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "numOutcomes";
          type: "u8";
        },
        {
          name: "outcomeLabels";
          type: {
            vec: "string";
          };
        },
        {
          name: "tags";
          type: {
            vec: "string";
          };
        },
        {
          name: "tradingFeeBps";
          type: "u16";
        },
        {
          name: "resolveAt";
          type: "i64";
        }
      ];
    },
    {
      name: "buyOutcome";
      accounts: [
        {
          name: "buyer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "buyerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalState";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "outcomeIndex";
          type: "u8";
        },
        {
          name: "amountUsdc";
          type: "u64";
        }
      ];
    },
    {
      name: "sellOutcome";
      accounts: [
        {
          name: "seller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "sellerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketVaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "globalState";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "outcomeIndex";
          type: "u8";
        },
        {
          name: "sharesToSell";
          type: "u64";
        }
      ];
    },
    {
      name: "resolveMarket";
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalState";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "winningOutcome";
          type: "u8";
        }
      ];
    },
    {
      name: "redeemWinnings";
      accounts: [
        {
          name: "winner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "winnerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketVaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "globalState";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "winningShares";
          type: "u64";
        }
      ];
    },
    {
      name: "claimPeg";
      accounts: [
        {
          name: "creator";
          isMut: true;
          isSigner: true;
        },
        {
          name: "creatorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketVaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "globalState";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "withdrawFees";
      accounts: [
        {
          name: "caller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "creatorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "invitorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "platformTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketVaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "globalState";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "emergencyPause";
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "globalState";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "emergencyUnpause";
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "globalState";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "getMarketOdds";
      accounts: [
        {
          name: "market";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "getUserPosition";
      accounts: [
        {
          name: "market";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "globalState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "platformWallet";
            type: "publicKey";
          },
          {
            name: "paused";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "userProfile";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "invitor";
            type: {
              option: "publicKey";
            };
          },
          {
            name: "referrerCode";
            type: "string";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "market";
      type: {
        kind: "struct";
        fields: [
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "invitor";
            type: {
              option: "publicKey";
            };
          },
          {
            name: "referrer";
            type: {
              option: "publicKey";
            };
          },
          {
            name: "numOutcomes";
            type: "u8";
          },
          {
            name: "outcomeLabels";
            type: {
              vec: "string";
            };
          },
          {
            name: "outcomePools";
            type: {
              vec: "u64";
            };
          },
          {
            name: "outcomeShares";
            type: {
              vec: "u64";
            };
          },
          {
            name: "tags";
            type: {
              vec: "string";
            };
          },
          {
            name: "tradingFeeBps";
            type: "u16";
          },
          {
            name: "resolveAt";
            type: "i64";
          },
          {
            name: "resolved";
            type: "bool";
          },
          {
            name: "winningOutcome";
            type: {
              option: "u8";
            };
          },
          {
            name: "creatorPegAmount";
            type: "u64";
          },
          {
            name: "creatorPegClaimed";
            type: "bool";
          },
          {
            name: "accumulatedFees";
            type: {
              vec: "u64";
            };
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "GlobalStateInitialized";
      fields: [
        {
          name: "authority";
          type: "publicKey";
          index: false;
        },
        {
          name: "platformWallet";
          type: "publicKey";
          index: false;
        }
      ];
    },
    {
      name: "UserProfileInitialized";
      fields: [
        {
          name: "user";
          type: "publicKey";
          index: false;
        },
        {
          name: "referrerCode";
          type: "string";
          index: false;
        }
      ];
    },
    {
      name: "MarketCreated";
      fields: [
        {
          name: "market";
          type: "publicKey";
          index: false;
        },
        {
          name: "creator";
          type: "publicKey";
          index: false;
        },
        {
          name: "numOutcomes";
          type: "u8";
          index: false;
        },
        {
          name: "tradingFeeBps";
          type: "u16";
          index: false;
        },
        {
          name: "resolveAt";
          type: "i64";
          index: false;
        }
      ];
    },
    {
      name: "SharesBought";
      fields: [
        {
          name: "market";
          type: "publicKey";
          index: false;
        },
        {
          name: "buyer";
          type: "publicKey";
          index: false;
        },
        {
          name: "outcomeIndex";
          type: "u8";
          index: false;
        },
        {
          name: "amountPaid";
          type: "u64";
          index: false;
        },
        {
          name: "sharesReceived";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "SharesSold";
      fields: [
        {
          name: "market";
          type: "publicKey";
          index: false;
        },
        {
          name: "seller";
          type: "publicKey";
          index: false;
        },
        {
          name: "outcomeIndex";
          type: "u8";
          index: false;
        },
        {
          name: "sharesSold";
          type: "u64";
          index: false;
        },
        {
          name: "amountReceived";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "MarketResolved";
      fields: [
        {
          name: "market";
          type: "publicKey";
          index: false;
        },
        {
          name: "winningOutcome";
          type: "u8";
          index: false;
        },
        {
          name: "resolvedAt";
          type: "i64";
          index: false;
        }
      ];
    },
    {
      name: "WinningsRedeemed";
      fields: [
        {
          name: "market";
          type: "publicKey";
          index: false;
        },
        {
          name: "winner";
          type: "publicKey";
          index: false;
        },
        {
          name: "amountRedeemed";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "CreatorPegClaimed";
      fields: [
        {
          name: "market";
          type: "publicKey";
          index: false;
        },
        {
          name: "creator";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "FeesWithdrawn";
      fields: [
        {
          name: "market";
          type: "publicKey";
          index: false;
        },
        {
          name: "recipient";
          type: "publicKey";
          index: false;
        },
        {
          name: "totalAmount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "ProgramPaused";
      fields: [
        {
          name: "pausedAt";
          type: "i64";
          index: false;
        }
      ];
    },
    {
      name: "ProgramUnpaused";
      fields: [
        {
          name: "unpausedAt";
          type: "i64";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 0;
      name: "ProgramPaused";
      msg: "Program is currently paused";
    },
    {
      code: 1;
      name: "Unauthorized";
      msg: "Unauthorized: only authority can perform this action";
    },
    {
      code: 2;
      name: "InvalidOutcomeCount";
      msg: "Invalid outcome count (must be 2-10)";
    },
    {
      code: 3;
      name: "OutcomeCountMismatch";
      msg: "Outcome count mismatch between labels and pools";
    },
    {
      code: 4;
      name: "InvalidTradingFee";
      msg: "Invalid trading fee (must be 1-500 bps)";
    },
    {
      code: 5;
      name: "InvalidOutcomeIndex";
      msg: "Invalid outcome index";
    },
    {
      code: 6;
      name: "MarketNotResolved";
      msg: "Market not resolved yet";
    },
    {
      code: 7;
      name: "MarketAlreadyResolved";
      msg: "Market already resolved";
    },
    {
      code: 8;
      name: "InvalidResolutionTime";
      msg: "Invalid resolution time";
    },
    {
      code: 9;
      name: "InsufficientFunds";
      msg: "Insufficient funds";
    },
    {
      code: 10;
      name: "ArithmeticOverflow";
      msg: "Arithmetic overflow";
    },
    {
      code: 11;
      name: "InvalidAmount";
      msg: "Invalid amount";
    },
    {
      code: 12;
      name: "UserProfileNotInitialized";
      msg: "User has not initialized their profile";
    },
    {
      code: 13;
      name: "InvitorAlreadySet";
      msg: "Invitor already set for this user";
    },
    {
      code: 14;
      name: "CannotInviteYourself";
      msg: "Cannot invite yourself";
    },
    {
      code: 15;
      name: "CreatorPegAlreadyClaimed";
      msg: "Creator peg already claimed";
    },
    {
      code: 16;
      name: "NoWinningsToRedeem";
      msg: "No winnings to redeem";
    },
    {
      code: 17;
      name: "NoFeesToWithdraw";
      msg: "No fees to withdraw";
    },
    {
      code: 18;
      name: "InvalidTokenMint";
      msg: "Invalid token mint";
    },
    {
      code: 19;
      name: "TokenAccountNotOwnedByUser";
      msg: "Token account must be owned by user";
    },
    {
      code: 20;
      name: "InsufficientShares";
      msg: "Insufficient shares to sell";
    },
    {
      code: 21;
      name: "ResolutionTimeNotReached";
      msg: "Market resolution time not reached";
    },
    {
      code: 22;
      name: "StringTooLong";
      msg: "String too long";
    },
    {
      code: 23;
      name: "ReferrerCodeInvalid";
      msg: "Referrer code invalid";
    },
    {
      code: 24;
      name: "UserNotAuthorized";
      msg: "User not authorized";
    },
    {
      code: 25;
      name: "CannotWithdrawUnresolved";
      msg: "Cannot withdraw from unresolved market";
    },
    {
      code: 26;
      name: "MaxOutcomesExceeded";
      msg: "Max outcomes exceeded";
    },
    {
      code: 27;
      name: "MinOutcomesNotMet";
      msg: "Min outcomes not met";
    },
    {
      code: 28;
      name: "ReferrerCodeInUse";
      msg: "Referrer code already in use";
    },
    {
      code: 29;
      name: "InvalidMarketState";
      msg: "Invalid market state";
    },
    {
      code: 30;
      name: "FeesAlreadyClaimed";
      msg: "Fees already claimed";
    },
    {
      code: 31;
      name: "MarketCalculationError";
      msg: "Market calculation error";
    }
  ];
};
