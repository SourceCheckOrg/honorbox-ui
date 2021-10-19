import { useState } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router'
import Cookie from 'js-cookie';
import PulseLoader from 'react-spinners/PulseLoader';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { injected } from '../lib/connectors';
import { useAuth } from '../context/auth';
import api from '../lib/api';
import NotificationPanel from '../components/NotificationPanel';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const SIGNIN_PATH = process.env.NEXT_PUBLIC_SIGNIN_PATH;
const SIGNIN_URL = `${API_HOST}${SIGNIN_PATH}`;
const SIGNIN_NONCE_PATH = process.env.NEXT_PUBLIC_SIGNIN_NONCE_PATH;
const SIGNIN_NONCE_URL = `${API_HOST}${SIGNIN_NONCE_PATH}`;

export default function NavBarButtons() {
  const router = useRouter();
  const { isAuthenticated, logout,setUser } = useAuth();
  const { active, account, connector, error, library: ethers, activate, deactivate } = useWeb3React();

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (error && error instanceof UnsupportedChainIdError && !errorMsg) {
    switchEthereumChain();
  }

  async function connect() {
    try {
      await activate(injected);
    } catch (err) {
      console.log(err);
      setErrorMsg(err.message)
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (err) {
      console.log(err);
      setErrorMsg(err.message)
    }
  }

  async function switchEthereumChain() {
    let provider;
    try {
      provider = await connector.getProvider();
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      setErrorMsg('Polygon Mainnet not found in Metamask! The network should be added according to https://docs.polygon.technology/docs/develop/network-details/network')
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{ 
              chainId: '0x89', 
              chainName: 'Polygon Mainnet', 
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/']
            }],
          });
          setErrorMsg('');
        } catch (addError) {
          setErrorMsg('For now, we only support Polygon Mainnet!');
        }
      }
      // handle other "switch" errors
    }
  }

  async function signIn() {
    let nonce;
    let signature;
    setLoading(true);
    
    // Fetch nonce to sign
    try {
      const res = await fetch(SIGNIN_NONCE_URL, {
        body: JSON.stringify({ ethAddr: account }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const result = await res.json();
      if (!result.nonce) {
        if (result.error && result.error === 'User is not registered!'); {
          setErrorMsg('User is not registered! Redirecting to Sign Up page ...');
          setTimeout(() => {
            setErrorMsg('');
            setLoading(false);
            window.open('https://profile.sourcecheck.org/sign-up', '_blank').focus();
          }, 3000);
          return;
        }
      }
      nonce = result.nonce;
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 3000);
      setLoading(false);
      return;
    }

    // Sign authentication message
    try {
      const signer = ethers.getSigner();
      const message = `Welcome to SourceCheck!\n\nSign in using ethereum account ${account} on Polygon Mainnet\n\nSession ID: ${nonce}`;
      signature = await signer.signMessage(message);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 3000);
      setLoading(false);
      return;
    }

    // Perform sign in
    try {
      const res = await fetch(SIGNIN_URL, {
        body: JSON.stringify({ ethAddr: account, signature }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const result = await res.json();
      if (result.error) {
        setErrorMsg(result.message);
        setTimeout(() => setErrorMsg(null), 3000);
        setLoading(false);
        return;
      }
      Cookie.set('token', result.jwt);
      api.defaults.headers.Authorization = `Bearer ${result.jwt}`;
      setUser(result.user);
      router.push('/profile');
      setLoading(false);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 3000);
      setLoading(false);
    }
  }

  function signOut() {
    logout();
    setUser(null);
    Router.push('/');
  }

  return (
    <>
      <NotificationPanel show={!!errorMsg} bgColor="bg-red-400" message={errorMsg} />
      <div className="flex items-center">
        <div className="flex-shrink-0">
          { active ? (  
            <>
              <div className="inline-block text-sm text-white h-9 px-4 py-2 mr-2 border border-white rounded-md bg-gray-600">
                {account.slice(0,7)}...{account.slice(account.length - 6)} (Polygon)
              </div>
              <button type="button" onClick={disconnect} className="relative inline-flex items-center h-9 mr-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                <span>Disconnect</span>
              </button>
              { !isAuthenticated ? (
                <>
                  { !loading ? (
                    <button type="button" onClick={signIn} className="relative inline-flex items-center h-9 mr-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                      <span>Sign In</span>
                    </button>
                  ) : (
                    <div className="relative top-1 inline-block text-center py-2 px-42 mr-2 border border-transparent shadow-sm rounded-md h-9 w-20 bg-indigo-500 hover:bg-indigo-600">
                      <PulseLoader
                        color="white"
                        loading={loading}
                        size={10}
                      />
                    </div>
                  )}
                  <button onClick={() => window.open('https://profile.sourcecheck.org/sign-up', '_blank').focus()} type="button" className="relative inline-flex items-center h-9 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"> 
                    <span>Sign Up</span>
                  </button>
                </>
              ) : (
                <></>
              )}
            </>
          ): (
            <button onClick={connect} className="relative inline-flex items-center mr-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">Connect MetaMask</button>
          )}
          { isAuthenticated ? (
            <button type="button" onClick={signOut} className="relative inline-flex items-center mr-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
              <span>Sign Out</span>
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
