import { useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { fetchRevenueShareData } from '../lib/solana';
import Layout from '../components/AppLayout';
import NotificationPanel from '../components/NotificationPanel';

// TODO remove test data
const sharedAcctStr = 'sqUEsnEZtf1VaWLfVTjuyYUzuFL3n4ppMvZHepW792n'
const stateAcctStr = 'CwHUNoXLxYDe4BmfAA6DY6fdkpMb3PsvKWZewJAjRjMD';

export default function Profile() {

  // State Account state
  const [stateAcct, setStateAcct] = useState(stateAcctStr); // TODO remove test data 
  const [sharedAcct, setSharedAcct] = useState(sharedAcctStr); // TODO remove test data
  const [sharedAcctBalance, setSharedAcctBalance] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [memberAccts, setMemberAccts] = useState([]);
  const [memberShares, setMemberShares] = useState([]);
  const [memberWithdraws, setMemberWithdraws] = useState([]);

  // UI state
  const [fetching, setFetching] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  function renderMemberAccts() {
    return memberAccts.map((memberAcct, idx) => {
      return (
        <div className="col-span-6 sm:col-span-4">
          <label htmlFor="member1Acct" className="block text-sm font-medium text-gray-700">Member {idx + 1} Account</label>
          <input
            type="text" 
            value={memberAcct}
            disabled
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
          />
        </div>
      );
    });
  }

  function renderMemberShares() {
    return memberShares.map((memberShare, idx) => {
      return (
        <div className="col-span-6 sm:col-span-4">
          <label htmlFor="member2Shares" className="block text-sm font-medium text-gray-700">Member {idx + 1} Shares</label>
          <input
            type="text" 
            value={memberShare + '%'}
            disabled
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
          />
        </div>
      );
    });
  }

  function renderMemberWithdraws() {
    return memberWithdraws.map((memberWithdraw, idx) => {
      return (
        <div className="col-span-6 sm:col-span-4">
          <label htmlFor="member1WithDraw" className="block text-sm font-medium text-gray-700">Member {idx + 1} Withdraw</label>
          <input
            type="text" 
            value={memberWithdraw}
            disabled
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
          />
        </div>
      );
    });
  }

  async function onSubmit (e) {
    e.preventDefault()
    setFetching(true);

    try {
      const stateAcctInfo = await fetchRevenueShareData(stateAcct, sharedAcct);
      let { sharedAcctBalance, isInitialized, memberAccts, memberShares, memberWithdraws } = stateAcctInfo;
      setSharedAcctBalance(sharedAcctBalance);
      setIsInitialized(isInitialized);
      setMemberAccts(memberAccts);
      setMemberShares(memberShares);
      setMemberWithdraws(memberWithdraws)
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
          <h1 className="text-2xl font-semibold text-gray-900">Fetch Revenue Share Data</h1>
        </div>
        <NotificationPanel show={fetchSuccess} bgColor="bg-green-100" message="Revenue Share data fetched!" />
        <NotificationPanel show={fetchError} bgColor="bg-red-100" message="Error fetching Revenue Share data!" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={onSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="stateAcct" className="block text-sm font-medium text-gray-700">State Account</label>
                  <input 
                    type="text" 
                    name="stateAcct" 
                    value={stateAcct}
                    onChange={evt => setStateAcct(evt.target.value)} 
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="sharedAcct" className="block text-sm font-medium text-gray-700">Shared Token Account</label>
                  <input 
                    type="text" 
                    name="sharedAcct" 
                    value={sharedAcct}
                    onChange={evt => setSharedAcct(evt.target.value)} 
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              { fetching ? (
                  <div className="inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md h-10 w-20 bg-indigo-600 hover:bg-indigo-700">
                    <PulseLoader color="white" loading={fetching} size={9} /> 
                  </div>
                ) : (
                  <button type="submit" className="h-10 w-20 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Fetch
                  </button>
                ) 
              }
              </div>
            </div>
          </form>
        </div>
      </div>
        
        <div className="py-6">
          <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Account Details</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="isInitialized" className="block text-sm font-medium text-gray-700">Shared Token Account Balance</label>
                    <input 
                      type="text" 
                      name="sharedAccBalance" 
                      value={sharedAcctBalance}
                      disabled
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="isInitialized" className="block text-sm font-medium text-gray-700">Is Initialized</label>
                    <input 
                      type="text" 
                      name="isInitialized" 
                      value={isInitialized}
                      disabled
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
                    />
                  </div>
                  { renderMemberAccts() }
                  { renderMemberShares() }
                  { renderMemberWithdraws() }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
