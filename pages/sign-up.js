import { useState } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { injected } from '../lib/connectors';
import PulseLoader from 'react-spinners/PulseLoader';
import Layout from '../components/AppLayout';
import Button from '../components/Button';
import NavBar from '../components/NavBar';
import NotificationPanel from '../components/NotificationPanel';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const SIGNUP_PATH = process.env.NEXT_PUBLIC_SIGNUP_PATH;
const SIGNUP_URL = `${API_HOST}${SIGNUP_PATH}`;
const SIGNUP_NONCE_PATH = process.env.NEXT_PUBLIC_SIGNUP_NONCE_PATH;
const SIGNUP_NONCE_URL = `${API_HOST}${SIGNUP_NONCE_PATH}`;

export default function SignUp() {
  const { active, account, library: ethers, connector, activate, deactivate } = useWeb3React();

  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
 
  // UI state
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  async function signUp(evt) {
    evt.preventDefault();

    if (!active) {
      setErrorMsg('Please connect to Metamask before signing up!');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    setLoading(true);
    let nonce;
    let signature;
    
    // Fetch nonce (challenge) to be included in signature
    try {
      const res = await fetch(SIGNUP_NONCE_URL, {
        body: JSON.stringify({ username, email }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const result = await res.json();
      nonce = result.nonce;
      setLoading(false);
      if (!nonce) {
        setErrorMsg(result.message);
        setTimeout(() => setErrorMsg(null), 3000);
        return;
      }
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
    
    // Sign authentication message
    try {
      const signer = ethers.getSigner();
      signature = await signer.signMessage(`Welcome to SourceCheck!\n\nSign up using ethereum account ${account} on Polygon\n\nSession ID: ${nonce}`);
      console.log('signature', signature);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    // Trigger account creation on backend
    try {
      const res = await fetch(SIGNUP_URL, {
        body: JSON.stringify({ username, email, eth_addr: account, signature }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      setSuccessMsg("Success!");
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  }

  if (successMsg) {
    return (
      <>
      <Layout>
         <main className="flex-1 overflow-y-auto focus:outline-none" tabIndex="0">
        <div className="max-w-7xl px-5 mt-5 mx-auto">
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1 px-3">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Sign Up</h3>
                  <p className="mt-1 text-sm text-gray-600">We have sent you an email with instructions on how to activate your account!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </main>
      </Layout>
      </> 
    );
  }

  return (
    <Layout>
      <NotificationPanel show={!!errorMsg} bgColor="bg-red-400" message={errorMsg} />
      <div className="max-w-7xl px-5 mt-5 mx-auto">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1 px-3">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Sign Up</h3>
                <p className="mt-1 text-sm text-gray-600">NOTE: We are going to send you an email with instructions on how to continue</p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={signUp}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 space-y-3 sm:p-6 bg-white">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="username"className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        id="username"
                        type="text"
                        name="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                      <input
                        id="email"
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
                    {loading ? (
                      <div className="inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md h-10 w-20 bg-indigo-600 hover:bg-indigo-700">
                        <PulseLoader
                          color="white"
                          loading={loading}
                          size={9}
                        />
                      </div>
                    ) : (
                      <Button type="submit" label="Sign Up" color="indigo" submit disabled={!username || !email}/>     
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
