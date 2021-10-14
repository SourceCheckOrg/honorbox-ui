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
const TWITTER_VERIFICATION_PATH = process.env.NEXT_PUBLIC_TWITTER_VERIFICATION_PATH;
const TWITTER_VERIFICATION_URL = `${API_HOST}${TWITTER_VERIFICATION_PATH}`;

export default function TwitterVerification() {
  const { account, library: ethers, activate } = useWeb3React();

  // Form state
  const [username, setUsername] = useState('');
  const [signature, setSignature] = useState();
  const [tweetUrl, setTweetUrl] = useState('');

  // UI state
  const [step, setStep] = useState(1);
  const [signing, setSigning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameDone, setUsernameDone] = useState(false);
  const [tweetDone, setTweetDone] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Messages
  const message = `Attestation: this twitter handle @${username} is linked to ethereum acct ${account} for @sourcecheckorg`
  const tweetMessage = `${message}\n\n${signature}`;
    
  useEffect(() => {
    activate(injected);
  },[])

  async function stepOneDone() {
    setUsernameDone(true);
    setStep(2);
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

  function postTweet() {
    const url = encodeURI(`https://twitter.com/intent/tweet?text=${tweetMessage}`);
    window.open(url, '_blank').focus();
  }

  function onMessageCopied() {
    setSuccessMsg('Message copied to clipboard!')
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function stepThreeDone() {
    setStep(4);
    setTweetDone(true);
  }

  async function verifyTweet() {
    setVerifying(true);
    const method = 'POST';
    const url = TWITTER_VERIFICATION_URL;
    const data = { username, tweetUrl };
    const headers = { "Content-Type": 'application/json' };
    try {
      await api.request({ method, url, data, headers });
      setVerified(true);
      setSuccessMsg('Twitter account verified successfully!')
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
      setErrorMsg(`Error verifying Twitter account: ${errorMsg}`);
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
                  <h1 className="flex-none inline-block text-2xl font-bold text-gray-800 mr-4">Twitter Verification</h1>
                  <svg className="mt-1 h-6 w-6" width="25" height="20" viewBox="0 0 32 32"><path d="M31.0934 8.58666C31.1883 8.5078 31.2594 8.40417 31.2989 8.28728C31.3384 8.1704 31.3446 8.04485 31.317 7.92461C31.2894 7.80438 31.2289 7.69417 31.1423 7.60626C31.0558 7.51835 30.9465 7.45618 30.8267 7.42666L29.7734 7.16C29.6776 7.13602 29.5884 7.09107 29.5121 7.02839C29.4358 6.96571 29.3744 6.88687 29.3323 6.79757C29.2902 6.70826 29.2685 6.61072 29.2687 6.51199C29.2688 6.41326 29.291 6.3158 29.3334 6.22666L29.9201 5.04C29.9755 4.92501 29.9967 4.79652 29.9813 4.66981C29.9658 4.54311 29.9143 4.4235 29.8329 4.32521C29.7514 4.22691 29.6435 4.15407 29.5219 4.11533C29.4002 4.07659 29.27 4.07358 29.1467 4.10666L26.4801 4.85333C26.3807 4.88231 26.276 4.88776 26.1742 4.86924C26.0723 4.85073 25.9762 4.80876 25.8934 4.74666C24.7394 3.88118 23.3359 3.41333 21.8934 3.41333C20.1253 3.41333 18.4296 4.11571 17.1794 5.36595C15.9291 6.61619 15.2267 8.31189 15.2267 10.08V10.56C15.2273 10.6419 15.1978 10.7211 15.1437 10.7826C15.0896 10.8441 15.0147 10.8835 14.9334 10.8933C11.1867 11.3333 7.60008 9.42666 3.73341 4.97333C3.64941 4.88069 3.5415 4.81301 3.42153 4.77772C3.30156 4.74244 3.17419 4.74092 3.05341 4.77333C2.9446 4.82334 2.85128 4.90174 2.78324 5.00028C2.7152 5.09882 2.67496 5.21386 2.66674 5.33333C2.13269 7.52712 2.34861 9.83656 3.28008 11.8933C3.30764 11.9479 3.31967 12.009 3.31485 12.0699C3.31004 12.1308 3.28857 12.1893 3.25278 12.2388C3.217 12.2884 3.16828 12.3271 3.11195 12.3508C3.05563 12.3746 2.99386 12.3823 2.93341 12.3733L1.44007 12.08C1.33402 12.0629 1.22542 12.0718 1.12352 12.1057C1.02161 12.1397 0.92942 12.1978 0.854788 12.275C0.780157 12.3523 0.725296 12.4464 0.694876 12.5494C0.664456 12.6524 0.659378 12.7613 0.680075 12.8667C0.795193 13.8899 1.13897 14.8742 1.68597 15.7466C2.23296 16.619 2.96916 17.3573 3.84008 17.9067C3.89643 17.934 3.94396 17.9766 3.97722 18.0296C4.01047 18.0827 4.02811 18.144 4.02811 18.2067C4.02811 18.2693 4.01047 18.3306 3.97722 18.3837C3.94396 18.4368 3.89643 18.4794 3.84008 18.5067L3.13341 18.7867C3.04759 18.8211 2.96986 18.873 2.90517 18.939C2.84048 19.0051 2.79024 19.0839 2.75764 19.1704C2.72503 19.2569 2.71079 19.3493 2.7158 19.4416C2.72081 19.5339 2.74497 19.6242 2.78674 19.7067C3.17753 20.5618 3.76988 21.3093 4.51301 21.8853C5.25613 22.4612 6.12785 22.8483 7.05341 23.0133C7.11776 23.0367 7.17336 23.0793 7.21265 23.1354C7.25194 23.1914 7.27302 23.2582 7.27302 23.3267C7.27302 23.3951 7.25194 23.4619 7.21265 23.518C7.17336 23.574 7.11776 23.6166 7.05341 23.64C5.24056 24.3898 3.29509 24.7662 1.33341 24.7467C1.1566 24.7113 0.97298 24.7476 0.822951 24.8476C0.672922 24.9477 0.56877 25.1032 0.533408 25.28C0.498046 25.4568 0.53437 25.6404 0.634389 25.7905C0.734409 25.9405 0.88993 26.0446 1.06674 26.08C4.46347 27.691 8.16165 28.5678 11.9201 28.6533C15.226 28.7038 18.4731 27.776 21.2534 25.9867C23.5404 24.4601 25.4141 22.3913 26.7076 19.9649C28.0011 17.5384 28.6741 14.8297 28.6667 12.08V10.92C28.6676 10.8232 28.6895 10.7277 28.7309 10.6402C28.7723 10.5527 28.8324 10.4753 28.9067 10.4133L31.0934 8.58666Z" fill="#00ACEE"></path></svg>
                </div>
                <p className="mt-4">This process is used to link your Twitter account to your Ethereum account by 
                entering your Twitter handle, signing a message using your private key, and finally,
                tweeting that message.</p>
              </div>
              <div className="bg-white px-10 py-10 sm:rounded-md shadow flex flex-row space-x-4">
                <div>
                  <span className={`inline-block ${step > 1 ? 'bg-green-200': 'bg-gray-300'} text-white text-md font-extrabold py-1 px-3 rounded-full`}>1</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Enter Account Handle</h2>
                  <p className="mt-4">Enter your Twitter account handle to verify and include in a message signed 
                  via your wallet.</p>
                  <div className="bg-gray-200 inline-block rounded-md px-2 mt-4 mr-4">
                    <span className="text-md text-gray-400 mr-2">@</span>
                    <input 
                      type="text" 
                      name="name" 
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      disabled={!!usernameDone}
                      className="bg-gray-200 inline-block w-96 border-transparent text-md focus:ring-gray-100 focus:border-gray-100" 
                    />
                  </div>
                  <div className={`inline-block mt-2 ${usernameDone ? 'hidden' : ''}`}>
                    <Button onClick={stepOneDone} color="indigo" label="Submit"/>
                  </div>
                </div>
              </div>
              <div className={`${ step > 1 ? 'bg-white' : 'bg-gray-100'} px-10 py-10 sm:rounded-md shadow flex flex-row space-x-4`}>
                <div>
                  <span className={`inline-block ${step > 2 ? 'bg-green-200': 'bg-gray-300'} text-white text-md font-extrabold py-1 px-3 rounded-full`}>2</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Signature Prompt</h2>
                  <p className="mt-4">Sign the message presented to you containing your Twitter handle and additional information.</p>
                  <div className={`${step > 1 ? 'block' : 'hidden'}`}>
                    <textarea 
                      value={message}
                      disabled
                      rows='3'
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
                  <h2 className="text-2xl font-bold text-gray-800">Tweet Message</h2>
                  <p className="mt-4">Tweet out your signed messaged to create a link between your Tezos account and your 
                  Twitter profile.</p>
                  <div className={`${step > 2 ? 'block' : 'hidden'}`}>
                    <textarea 
                      value={tweetMessage}
                      disabled
                      rows='5'
                      className="bg-gray-200 border-transparent inline-block w-full rounded-md mt-4"
                    />
                    <div className={`mt-2 ${tweetDone ? 'hidden' : 'inline-block'}`}>
                      <CopyToClipboard text={tweetMessage} onCopy={onMessageCopied}>
                        <button className="h-30 w-30 inline-flex justify-center py-2 px-4 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Copy to clipboard
                        </button>
                      </CopyToClipboard>
                    </div>
                    <div className={`mt-2 ${tweetDone ? 'hidden' : 'inline-block'}`}>
                      <Button onClick={postTweet} color="indigo" label="Tweet"/>
                    </div>
                    <div className={`mt-2 ${tweetDone ? 'hidden' : 'inline-block'}`}>
                      <Button onClick={stepThreeDone} color="indigo" label="Done"/>
                    </div>

                  </div>
                </div>
              </div>
              <div className={`${ step > 3 ? 'bg-white' : 'bg-gray-100'} px-10 py-10 sm:rounded-md shadow flex flex-row space-x-4`}>
                <div>
                  <span className={`inline-block ${verified ? 'bg-green-200': 'bg-gray-300'} text-white text-md font-extrabold py-1 px-3 rounded-full`}>4</span>
                </div>
                <div className="w-full">
                  <h2 className="text-2xl font-bold text-gray-800">Verify Signature</h2>
                  <p className="mt-4">Paste your tweet URL in order to verify it.</p>
                  <div className={`${step > 3 ? 'block' : 'hidden'}`}>
                    <input 
                      type="text" 
                      name="tweetUrl" 
                      value={tweetUrl}
                      onChange={e => setTweetUrl(e.target.value)}
                      required
                      disabled={!!verified}
                      className="bg-gray-200 inline-block w-full rounded-md border-gray-100 sm:text-sm focus:ring-gray-100 focus:border-gray-100 mt-4" 
                    />
                    { !verified ? (
                      <div className={`inline-block mt-4 ${verified ? 'hidden' : ''}`}>
                        <LoaderButton color="indigo" loading={verifying} hidden={!verifying}/>
                        <Button color="indigo" label="Verify Tweet" hidden={verifying} onClick={() => verifyTweet()} />
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
