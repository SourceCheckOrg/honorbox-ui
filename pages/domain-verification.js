import { useEffect, useState } from 'react';
import Link from 'next/link';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useWeb3React } from '@web3-react/core'
import { injected } from '../lib/connectors';
import api from '../lib/api';
import Protected from '../components/Protected';
import Layout from '../components/AppLayout';
import NotificationPanel from '../components/NotificationPanel';
import Button from "../components/Button";
import LoaderButton from "../components/LoaderButton";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const DOMAIN_VERIFICATION_PATH = process.env.NEXT_PUBLIC_DOMAIN_VERIFICATION_PATH;
const DOMAIN_VERIFICATION_URL = `${API_HOST}${DOMAIN_VERIFICATION_PATH}`;

export default function DomainVerification() {
  const { account, library: ethers, activate } = useWeb3React();

  // Form state
  const [domainName, setDomainName] = useState('');
  const [signature, setSignature] = useState();
  
  // UI state
  const [step, setStep] = useState(1);
  const [domainNameDone, setDomainNameDone] = useState(false);
  const [signing, setSigning] = useState(false);
  const [updateTxtRecordDone, setUpdateTxtRecordDone] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Messages
  const message = `Ethereum Signed Message: ${domainName} is linked to ${account}`
  const txtRecord = `sc-profile-verification=${signature}`;

  useEffect(() => {
    activate(injected);
  },[])

  async function stepOneDone() {
    setDomainNameDone(true);
    setStep(2);
  }

  function onMessageCopied() {
    setSuccessMsg('Message copied to clipboard!')
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function stepThreeDone() {
    setUpdateTxtRecordDone(true)
    setStep(4);
  }

  async function signMessage() {
    try {
      setSigning(true);
      const signer = ethers.getSigner();
      const signature = await signer.signMessage(message);
      setSignature(signature);
      setSigning(false);
      setStep(3);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 3000);
      setSigning(false);
      return;
    }
  }

  async function verifyDomain() {
    setVerifying(true);
    const method = 'POST';
    const url = DOMAIN_VERIFICATION_URL;
    const data = { domainName };
    const headers = { "Content-Type": 'application/json' };
    try {
      await api.request({ method, url, data, headers });
      setSuccessMsg('Domain name verified successfully!')
      setVerified(true);
      setVerifying(false);
    } catch (err) {
      let errorMsg;
      if (err.response) {
        errorMsg = err.response.data.message;
      } else if (err.request) {
        errorMsg = err.request;
      } else {
        errorMsg = err.message;
      }
      setErrorMsg(`Error verifying domain name: ${errorMsg}`);
      setTimeout(() => setErrorMsg(null), 3000);
      setVerifying(false);
    }
  }

  return (
    <>
      <NotificationPanel show={!!successMsg} bgColor="bg-green-400" message={successMsg} />
      <NotificationPanel show={!!errorMsg} bgColor="bg-red-400" message={errorMsg} />
      <Protected>
        <Layout>
          <main className="flex-1 overflow-y-auto focus:outline-none" tabIndex="0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex flex-col space-y-4">
              <div className="bg-white px-10 py-10 sm:rounded-md shadow">
                <div className="flex">
                  <h1 className="flex-none mr-4 text-2xl font-bold text-gray-800">Domain Verification</h1>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#6366f1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                
                <p className="mt-4">This process is used to link your Web domain name to your Ethereum account by 
                signing a message using your private key, storing the signature in a TXT record, and finally retrieving
                that data for verification.</p>
              </div>
              <div className="bg-white px-10 py-10 sm:rounded-md shadow flex flex-row space-x-4">
                <div>
                  <span className={`inline-block ${step > 1 ? 'bg-green-200': 'bg-gray-300'} text-white text-md font-extrabold py-1 px-3 rounded-full`}>1</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Enter Web Domain Name</h2>
                  <p className="mt-4">Please enter the web domain you wish to prove ownership of.</p>
                  <input 
                    type="text" 
                    name="domainName" 
                    value={domainName}
                    onChange={e => setDomainName(e.target.value)}
                    required
                    disabled={!!domainNameDone}
                    className="bg-gray-200 inline-block w-96 border-transparent rounded-md  px-2 mt-4 mr-2 sm:text-sm focus:ring-gray-100 focus:border-gray-100" 
                  />
                  <div className={`inline-block mt-2 ${domainNameDone ? 'hidden' : ''}`}>
                    <Button onClick={stepOneDone} color="indigo" label="Submit"/>
                  </div>
                </div>
              </div>
              <div className={`${ step > 1 ? 'bg-white' : 'bg-gray-100'} px-10 py-10 sm:rounded-md shadow flex flex-row space-x-4`}>
                <div>
                  <span className={`inline-block ${step > 2 ? 'bg-green-200': 'bg-gray-300'} text-white text-md font-extrabold py-1 px-3 rounded-full`}>2</span>
                </div>
                <div className="w-full">
                  <h2 className="text-2xl font-bold text-gray-800">Signature Prompt</h2>
                  <p className="mt-4">Sign the message presented to you containing your domain.</p>
                  <div className={`${step === 2 ? 'block' : 'hidden'}`}>
                    <textarea 
                      value={message}
                      disabled
                      rows='2'
                      className="bg-gray-200 border-gray-100 inline-block w-full rounded-md mt-4"
                    />
                    <div className={`mt-2 ${signature ? 'hidden' : ''}`}>
                      <Button color="indigo" label="Sign Message" hidden={signing} onClick={signMessage}/>
                      <LoaderButton color="indigo" loading={signing} hidden={!signing}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${ step > 2 ? 'bg-white' : 'bg-gray-100'} px-10 py-10 sm:rounded-md shadow flex flex-row space-x-4`}>
                <div>
                  <span className={`inline-block ${step > 3 ? 'bg-green-200': 'bg-gray-300'} text-white text-md font-extrabold py-1 px-3 rounded-full`}>3</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Upload TXT Record</h2>
                  <p className="mt-4">In your DNS settings, add a new TXT record for @ and copy and put the following 
                  text as the value. Keep in mind that DNS propagation can take some time. This process may take a 
                  few minutes for the verification to successfully complete.</p>
                  <p className="mt-4">For more information on how to add a TXT record, check out these example guides:{' '} 
                  <a className="text-indigo-500" target="_blank" href="https://www.godaddy.com/help/add-a-txt-record-19232">Go Daddy</a>,{' '} 
                  <a className="text-indigo-500" target="_blank" href="https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/">Namecheap</a>,{' '}
                  <a className="text-indigo-500" target="_blank" href="https://vercel.com/support/articles/how-to-manage-vercel-dns-records">Vercel</a>.
                  </p>
                  <div className={`${step === 3 ? 'block' : 'hidden'}`}>
                    <textarea 
                      value={txtRecord}
                      disabled
                      rows='3'
                      className="bg-gray-200 border-transparent inline-block w-full rounded-md mt-4"
                    />
                    <div className={updateTxtRecordDone ? 'hidden' : ''}>
                      <div className={`inline-block mt-2`}>
                        <CopyToClipboard text={txtRecord} onCopy={onMessageCopied}>
                          <button className="h-30 w-30 inline-flex justify-center py-2 px-4 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Copy
                          </button>
                        </CopyToClipboard>
                      </div>
                      <div className={`inline-block mt-2`}>
                        <Button onClick={stepThreeDone} color="indigo" label="Done"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${ step > 2 ? 'bg-white' : 'bg-gray-100'} px-10 py-10 sm:rounded-md shadow flex flex-row space-x-4`}>
                <div>
                  <span className={`inline-block ${verified ? 'bg-green-200': 'bg-gray-300'} text-white text-md font-extrabold py-1 px-3 rounded-full`}>4</span>
                </div>
                <div className="w-full">
                  <h2 className="text-2xl font-bold text-gray-800">Verify Domain</h2>
                  <p className="mt-4">Verify your signed message below.</p>
                  <div className={`${step > 3 ? 'block' : 'hidden'}`}>
                    { !verified ? (
                      <div className={`inline-block mt-4 ${verified ? 'hidden' : ''}`}>
                        <LoaderButton color="indigo" loading={verifying} hidden={!verifying}/>
                        <Button color="indigo" label="Verify Domain" hidden={verifying} onClick={() => verifyDomain()} />
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Link href="/profile">
                          <span className="h-30 w-30 inline-flex justify-center py-2 px-4 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Back to profile
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </Layout>
      </Protected>
    </>
  );
}
