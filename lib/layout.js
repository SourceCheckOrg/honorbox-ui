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
  publicKey("member3Acct"),
  publicKey("member4Acct"),
  publicKey("member5Acct"),
  publicKey("member6Acct"),
  publicKey("member7Acct"),
  publicKey("member8Acct"),
  publicKey("member9Acct"),
  publicKey("member10Acct"),
  publicKey("member11Acct"),
  BufferLayout.u16("member1Shares"),
  BufferLayout.u16("member2Shares"),
  BufferLayout.u16("member3Shares"),
  BufferLayout.u16("member4Shares"),
  BufferLayout.u16("member5Shares"),
  BufferLayout.u16("member6Shares"),
  BufferLayout.u16("member7Shares"),
  BufferLayout.u16("member8Shares"),
  BufferLayout.u16("member9Shares"),
  BufferLayout.u16("member10Shares"),
  BufferLayout.u16("member11Shares"),
  uint64("member1Withdraw"),
  uint64("member2Withdraw"),
  uint64("member3Withdraw"),
  uint64("member4Withdraw"),
  uint64("member5Withdraw"),
  uint64("member6Withdraw"),
  uint64("member7Withdraw"),
  uint64("member8Withdraw"),
  uint64("member9Withdraw"),
  uint64("member10Withdraw"),
  uint64("member11Withdraw"),
]);
