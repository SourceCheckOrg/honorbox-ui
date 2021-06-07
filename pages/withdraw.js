import { useState, useEffect } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { useRouter } from 'next/router'
import { fetchRevenueShareData, getTokenAccountsByOwner, getWallet, withdraw } from '../lib/solana';
import Button from "../components/Button";
import Layout from '../components/AppLayout';
import NotificationPanel from '../components/NotificationPanel';

const TOKEN_MINT_ACCT = process.env.NEXT_PUBLIC_TOKEN_MINT_ACCT;

export default function Withdraw() {
  // Get url query params
  const router = useRouter();
  const stateAcct = router.query.stateAcct || '';
  const sharedAcct = router.query.sharedAcct || '';

  // Shared account balance
  const [sharedAcctBalance, setSharedAcctBalance] = useState('');

  // State account state 
  const [member1Acct, setMember1Acct] = useState('');
  const [member2Acct, setMember2Acct] = useState('');
  const [member1Shares, setMember1Shares] = useState('');
  const [member2Shares, setMember2Shares] = useState('');
  const [member1Withdraw, setMember1Withdraw] = useState('');
  const [member2Withdraw, setMember2Withdraw] = useState('');

  // Withdraw state
  const [maxWithdrawAmount, setMaxWithdrawAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAcct, setWithdrawAcct] = useState('');
  const [walletAcct, setWalletAcct] = useState('');
  
  // UI state
  const [fetching, setFetching] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [wallet, setWallet] = useState(null);

  // Update shared account balance and state account state
  useEffect(async () => {
    if (stateAcct && sharedAcct) {
      const data = await fetchRevenueShareData(stateAcct, sharedAcct);
      setSharedAcctBalance(data.sharedAcctBalance);
      setMember1Acct(data.member1Acct);
      setMember2Acct(data.member2Acct);
      setMember1Shares(data.member1Shares);
      setMember2Shares(data.member2Shares);
      setMember1Withdraw(data.member1Withdraw);
      setMember2Withdraw(data.member2Withdraw);
    } 
  }, [stateAcct, sharedAcct])

  async function onConnectWallet() {
    const wallet = await getWallet();
    setWallet(wallet);
    setWalletAcct(wallet.publicKey.toBase58());
    const tokenAccts = await getTokenAccountsByOwner(wallet.publicKey); // TODO: filter using token mint address
    const withdrawAcct = tokenAccts.value[0].pubkey.toBase58();
    setWithdrawAcct(withdrawAcct);
  }

  function calculateMaxWithdrawAmount() {
    const totalDeposited = sharedAcctBalance + member1Withdraw + member2Withdraw;
    const isMember1 = (walletAcct === member1Acct);
    let maxWithdrawAmount;
    if (isMember1) {
      maxWithdrawAmount = (totalDeposited * member1Shares / 100) - member1Withdraw;
    } else {
      maxWithdrawAmount = (totalDeposited * member2Shares / 100) - member2Withdraw;
    }
    setWithdrawAmount(maxWithdrawAmount)
  }

  async function onSubmit (e) {
    e.preventDefault()
    setFetching(true);

    try {
      await withdraw(stateAcct, sharedAcct, withdrawAmount, withdrawAcct);
      const data = await fetchRevenueShareData(stateAcct, sharedAcct);
      setMember1Withdraw(data.member1Withdraw);
      setMember2Withdraw(data.member2Withdraw);
      setFetching(false);
      setFetchSuccess(true)
      setTimeout(() => setFetchSuccess(false), 2000)
    } catch (err) {
      setFetching(false);
      setFetchError(true);
      setTimeout(() => setFetchError(false), 2000)
    }
  }

  return (
    <Layout>
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
        <div className="max-w-7xl mx-auto mb-4 mt-6 px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Withdraw</h1>
        </div>
        <NotificationPanel show={fetchSuccess} bgColor="bg-green-100" message="Withdraw successful!" />
        <NotificationPanel show={fetchError} bgColor="bg-red-100" message="Error withdrawing funds!" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={onSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-3 bg-white space-y-3 sm:p-6">
              <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="stateAccount" className="block text-sm font-medium text-gray-700">State Account</label>
                  <input 
                    type="text" 
                    name="stateAccountt" 
                    value={stateAcct}
                    disabled
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="sharedAccount" className="block text-sm font-medium text-gray-700">Shared Token Account</label>
                  <input 
                    type="text" 
                    name="sharedAccount" 
                    value={sharedAcct}
                    disabled
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="tokenMintAccount" className="block text-sm font-medium text-gray-700">Token Mint Account</label>
                  <input 
                    type="text" 
                    name="tokenMintAccount" 
                    value={TOKEN_MINT_ACCT}
                    disabled
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="withdrawAccount" className="block text-sm font-medium text-gray-700">Withdraw Account</label>
                  <input 
                    type="text" 
                    name="withdrawAccount" 
                    value={withdrawAcct}
                    onChange={evt => setWithdrawAcct(evt.target.value)} 
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700">
                    Withdraw Amount [<a className="text-indigo-700 cursor-pointer" onClick={calculateMaxWithdrawAmount}>max</a>]
                  </label>
                  <input 
                    type="text" 
                    name="withdrawAmount" 
                    value={withdrawAmount}
                    onChange={evt => setWithdrawAmount(evt.target.value)} 
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                  />
                </div>
                
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              { !wallet ? (
                  <Button label="Connect Wallet" color="indigo" disabled={false} onClick={onConnectWallet} />
                ) : (
                  <></>
                )
              }
              { fetching ? (
                    <div className="inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md h-10 w-20 bg-indigo-600 hover:bg-indigo-700">
                      <PulseLoader color="white" loading={fetching} size={9} /> 
                    </div>
                  ) : (
                    <button type="submit" className="h-10 w-20 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Withdraw
                    </button>
                  ) 
                }
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  </Layout>
  );
}
