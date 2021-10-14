import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { useState } from 'react';
import { injected } from '../lib/connectors';

export default function Twitter() {
  const { active, account, library: ethers, connector, activate, deactivate } = useWeb3React();
  const [signature, setSignature] = useState('');
  
  async function connect() {
    try {
      await activate(injected);
    } catch (err) {
        console.log(err);
    }
  }

  async function disconnect() {
    try {
      await deactivate();
    } catch (err) {
      console.log(err);
    }
  }

  async function sign() {
    const signer = ethers.getSigner();
    const signature = await signer.signMessage(`I am attesting that this twitter handle @jmsofarelli is linked to the Ethereum acct ${account} for @sourcecheckorg`);
    setSignature(signature);
    console.log('signature', signature);
  }

  return (
    <div className="flex flex-col items-center justify-center">
        <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>
        {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
        <button onClick={disconnect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Disconnect</button>
        <button onClick={sign} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Sign</button>
        <span>Signature: {signature}</span>
    </div>
  );
}
