import BN from "bn.js";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";
import Wallet from "@project-serum/sol-wallet-adapter";
import { STATE_ACCT_DATA_LAYOUT } from "./layout";

const REV_SHARING_PROGRAM_ID = process.env.NEXT_PUBLIC_REV_SHARING_PROGRAM_ID;
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const TOKEN_MINT_ACCT = process.env.NEXT_PUBLIC_TOKEN_MINT_ACCT;
const WALLET_PROVIDER = process.env.NEXT_PUBLIC_WALLET_PROVIDER;
const SC_ACCT = process.env.NEXT_PUBLIC_SC_ACCT;
const SC_FEE_PERC = parseFloat(process.env.NEXT_PUBLIC_SC_FEE_PERC);
const connection = new Connection(process.env.NEXT_PUBLIC_CONNECT_URL, "singleGossip");
let wallet;

async function connectWallet() {
  if (!wallet) {
    wallet = new Wallet(WALLET_PROVIDER);
    wallet.on("connect", (publicKey) => console.log("Wallet connected to " + publicKey.toBase58()));
    wallet.on("disconnect", () => console.log("Wallet disconnected"));
    await wallet.connect();
  }
}

export const getWallet = async () => {
  await connectWallet();
  return wallet;
}

export const findAssociatedTokenAddress = async (walletAcct, tokenMintAcct) => {
  return (await PublicKey.findProgramAddress(
    [
      walletAcct.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAcct.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  ))[0];
}

export const fetchRevenueShareData = async (stateAcct, sharedAcct) => {
  // Get state account data
  const stateAcctPubkey = new PublicKey(stateAcct);
  const stateAcctInfo = await connection.getAccountInfo(stateAcctPubkey, "singleGossip");
  const stateAcctData = STATE_ACCT_DATA_LAYOUT.decode(stateAcctInfo.data);

  // Get shared account data
  const tokenMintPubKey = new PublicKey(TOKEN_MINT_ACCT);
  const token = new Token(connection, tokenMintPubKey, TOKEN_PROGRAM_ID, null);
  const sharedAcctPubKey = new PublicKey(sharedAcct);
  const tokenAccountInfo = await token.getAccountInfo(sharedAcctPubKey);
  const sharedAcctBalance = tokenAccountInfo.amount.toNumber() / 100;

  return {
    isInitialized: !!stateAcctData.isInitialized,
    memberAccts: [
      new PublicKey(stateAcctData.member1Acct).toBase58(),
      new PublicKey(stateAcctData.member2Acct).toBase58(),
      new PublicKey(stateAcctData.member3Acct).toBase58(),
      new PublicKey(stateAcctData.member4Acct).toBase58(),
      new PublicKey(stateAcctData.member5Acct).toBase58(),
      new PublicKey(stateAcctData.member6Acct).toBase58(),
      new PublicKey(stateAcctData.member7Acct).toBase58(),
      new PublicKey(stateAcctData.member8Acct).toBase58(),
      new PublicKey(stateAcctData.member9Acct).toBase58(),
      new PublicKey(stateAcctData.member10Acct).toBase58(),
      new PublicKey(stateAcctData.member11Acct).toBase58(),  
    ],
    memberShares: [
      stateAcctData.member1Shares / 100,
      stateAcctData.member2Shares / 100,
      stateAcctData.member3Shares / 100,
      stateAcctData.member4Shares / 100,
      stateAcctData.member5Shares / 100,
      stateAcctData.member6Shares / 100,
      stateAcctData.member7Shares / 100,
      stateAcctData.member8Shares / 100,
      stateAcctData.member9Shares / 100,
      stateAcctData.member10Shares / 100,
      stateAcctData.member11Shares / 100,
    ],
    memberWithdraws: [
      parseFloat(new BN(stateAcctData.member1Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member2Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member3Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member4Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member5Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member6Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member7Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member8Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member9Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member10Withdraw, 10, "le").toNumber() / 100),
      parseFloat(new BN(stateAcctData.member11Withdraw, 10, "le").toNumber() / 100),
    ],
    sharedAcctBalance,
  };
}

export const getTokenAccountsByOwner = async (ownerAcct) => {
  const ownerAcctPubKey = new PublicKey(ownerAcct);
  return await connection.getParsedTokenAccountsByOwner(ownerAcctPubKey, {programId: TOKEN_PROGRAM_ID });
}

function getMemberPublicKeys(accounts) {
  // Add SourceCheck account as the first account
  accounts.unshift(SC_ACCT);
  
  // Map public key strings to proper objects used on initialization instruction
  const memberPublicKeys = accounts.map(account => {
    return {
      pubkey: new PublicKey(account),
      isSigner: false, 
      isWritable: false
    }
  });
  
  // Fill remaining slots with empty accounts
  while(memberPublicKeys.length < 11) {
    memberPublicKeys.push({
      pubkey: new PublicKey(0),
      isSigner: false, 
      isWritable: false
    });
  }
  return memberPublicKeys;
}

function getAllShares(shares) {
  // Add SourceCheck fee percentage
  const scFeePerc = parseFloat(SC_FEE_PERC);
  shares.unshift(scFeePerc); // idx = 0

  // Remaining percentage (as a fraction) to members after subtracting SourceCheck fee
  const remainingPerc = (100 - scFeePerc) / 100;

  // Calculate proportional shares after subtracting SourceCheck fees
  const allSharesBN = shares.map((memberShares, idx) =>  {
    if (idx === 0) return new BN(parseInt(memberShares * 100)).toArray("le", 2); // SorceCheck fee is not affected
    return new BN(parseInt(memberShares * remainingPerc * 100)).toArray("le", 2);
  });
  
  // Fill remaining slots with 0 shares
  while(allSharesBN.length < 11) {
    allSharesBN.push(new BN(0).toArray("le", 2));
  }

  // Unpack BN arrays to create a single binary array
  let allShares = [];
  allSharesBN.forEach(sharesBN => {
    allShares = [...allShares, ...sharesBN];
  });
  return allShares;
}

export const initRevenueShare = async (accounts, shares) => {
    await connectWallet();

    // Convert values and types and fill with empty data in order to have arrays with 11 elements
    const memberPublicKeys = getMemberPublicKeys(accounts);
    const allShares = getAllShares(shares)

    console.log('memberPublicKeys', memberPublicKeys);
    console.log('allShares', allShares);

    // Get account of initilizer
    const initAcctPubKey = wallet.publicKey;
        
    // Create shared account instruction
    const sharedAcct = new Account();
    const sharedAcctPubKey = sharedAcct.publicKey;
    const sharedAcctLamports = await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip');
    console.log('minimum balance for rent exemption', sharedAcctLamports);
    const createSharedAcctIx = SystemProgram.createAccount({
        fromPubkey: initAcctPubKey,         // The account that will transfer lamports to the created account
        lamports: sharedAcctLamports,       // Amount of lamports to transfer to the created account
        newAccountPubkey: sharedAcctPubKey, // Public key of the created account
        programId: TOKEN_PROGRAM_ID,        // Public key of the program to assign as the owner of the created account
        space: AccountLayout.span,          // Amount of space in bytes to allocate to the created account
    });
    
    // Initialize shared account instruction
    const tokenMintAcctPubKey = new PublicKey(TOKEN_MINT_ACCT);
    const initSharedAcctIx = Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,       // SPL Token program account
        tokenMintAcctPubKey,    // Token mint account
        sharedAcctPubKey,       // New account
        initAcctPubKey,         // Owner of the new account (shared account)
    );
    
    // Create state account instruction
    const stateAcct = new Account();
    const stateAcctPubKey = stateAcct.publicKey;
    const revSharingProgramPubKey = new PublicKey(REV_SHARING_PROGRAM_ID);
    const stateAcctLamports = await connection.getMinimumBalanceForRentExemption(STATE_ACCT_DATA_LAYOUT.span, 'singleGossip')
    const createStateAcctIx = SystemProgram.createAccount({
        fromPubkey: initAcctPubKey,
        lamports: stateAcctLamports,
        newAccountPubkey: stateAcctPubKey,
        programId: revSharingProgramPubKey,
        space: STATE_ACCT_DATA_LAYOUT.span,
    });

    // Initialize revenue sharing instruction
    const initRevSharingIx = new TransactionInstruction({
        programId: revSharingProgramPubKey,
        keys: [
            { pubkey: initAcctPubKey, isSigner: true, isWritable: false },
            { pubkey: sharedAcctPubKey, isSigner: false, isWritable: true },
            { pubkey: stateAcctPubKey, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            ...memberPublicKeys,
        ],
        data: Buffer.from(Uint8Array.of(0, ...allShares)),
    })

    // Create the transaction with all instructions to be submitted
    const tx = new Transaction().add(
        createSharedAcctIx, 
        initSharedAcctIx,
        createStateAcctIx,
        initRevSharingIx
    );
    
    // Get recent block hash
    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = initAcctPubKey;
    tx.partialSign(sharedAcct, stateAcct);
            
    // Sign transaction
    let signedTx = await wallet.signTransaction(tx);

    // Send transaction and wait confirmation
    let txId = await connection.sendRawTransaction(signedTx.serialize(), { 
      skipPreflight: false, 
      preflightCommitment: 'confirmed'
    });

    await connection.confirmTransaction(txId);
    
    // Get account state acct data
    const stateAcctInfo = await connection.getAccountInfo(stateAcctPubKey, 'singleGossip');
    const stateAccData = STATE_ACCT_DATA_LAYOUT.decode(stateAcctInfo.data);

    return {
        //isInitialized: !!stateAccData.isInitialized,
        //initAcct: initAcctPubKey.toBase58(),
        stateAcct: stateAcctPubKey.toBase58(),
        sharedAcct: sharedAcctPubKey.toBase58(),
        /*
        member1Acct: new PublicKey(stateAccData.member1Acct).toBase58(),
        member1Shares: new BN(stateAccData.member1Shares, 10, "le").toNumber(),
        member2Acct: new PublicKey(stateAccData.member2Acct).toBase58(),
        member2Shares: new BN(stateAccData.member2Shares, 10, "le").toNumber()
        */
    };
}

export const withdraw = async (stateAcct, sharedAcct, withdrawAmount, withdrawAcct) => {
  try {
    withdrawAmount = Math.round(parseFloat(withdrawAmount) * 100)
    await connectWallet();

    // 0. Initializer account
    const initAcctPubKey = wallet.publicKey;

    // 1. State account
    const stateAcctPubKey = new PublicKey(stateAcct);

    // 2. Shared account
    const sharedAcctPubKey = new PublicKey(sharedAcct);

    // 3. Withdraw account
    const withdrawAcctPubKey = new PublicKey(withdrawAcct);

    // 4. Token program account => TOKEN_PROGRAM_ID

    // 5. PDA account
    const programId = new PublicKey(REV_SHARING_PROGRAM_ID);
    const pdaAcctPubKey = await PublicKey.findProgramAddress([Buffer.from("revenue_sharing")], programId);

    // Withdraw instruction
    const withdrawIx = new TransactionInstruction({
      programId,
      data: Buffer.from(Uint8Array.of(1, ...new BN(withdrawAmount).toArray("le", 8))),
      keys: [
        { pubkey: initAcctPubKey, isSigner: true, isWritable: false },
        { pubkey: stateAcctPubKey, isSigner: false, isWritable: true },
        { pubkey: sharedAcctPubKey, isSigner: false, isWritable: true },
        { pubkey: withdrawAcctPubKey, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: pdaAcctPubKey[0], isSigner: false, isWritable: false },
      ],
    });

    // Get recent block hash
    let { blockhash } = await connection.getRecentBlockhash();

    // Transaction
    const tx = new Transaction().add(withdrawIx);
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    let signedTx = await wallet.signTransaction(tx);

    let txId = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txId);

    return txId;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
