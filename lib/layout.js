import * as BufferLayout from "buffer-layout";

/**
 * Layout for a public key
 */
const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};

export const STATE_ACCT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  publicKey("member1Acct"),
  publicKey("member2Acct"),
  BufferLayout.u16("member1Shares"),
  BufferLayout.u16("member2Shares"),
  uint64("member1Withdraw"),
  uint64("member2Withdraw"),
]);
