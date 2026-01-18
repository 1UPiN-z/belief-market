import * as anchor from "@anchor-lang/anchor";

export const workspace = anchor.workspace;

before(async () => {
  // Load the program
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
});
