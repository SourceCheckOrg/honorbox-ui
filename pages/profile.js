import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { ethers } from "ethers";
import Link from 'next/link';
import slugIt from "slug";
import useSWR from 'swr'
import PulseLoader from 'react-spinners/PulseLoader';
import { useAuth } from '../context/auth';
import api from '../lib/api';
import { injected } from '../lib/connectors';
import JsonModal from '../components/JsonModal';
import Layout from '../components/AppLayout';
import LoaderButton from "../components/LoaderButton";
import NotificationPanel from '../components/NotificationPanel';
import Protected from '../components/Protected';
import SC_PROFILE_FACTORY_ABI from '../contracts/SourceCheckProfileFactory';

const PUBLISHER_PATH = process.env.NEXT_PUBLIC_PUBLISHER_PATH;
const TWITTER_PATH = process.env.NEXT_PUBLIC_TWITTER_PATH
const DOMAIN_PATH = process.env.NEXT_PUBLIC_DOMAIN_PATH;
const UPDATE_USER_PATH = process.env.NEXT_PUBLIC_UPDATE_USER_PATH;

const SC_PROFILE_FACTORY_ADDR = process.env.NEXT_PUBLIC_SC_PROFILE_FACTORY_ADDR;
const SERVICE_ADDR = process.env.NEXT_PUBLIC_SERVICE_ADDR;
const SERVICE_FEE_PERC = process.env.NEXT_PUBLIC_SERVICE_FEE_PERC;

export default function Profile() {
  const { account, library: provider, activate } = useWeb3React();

  // Data fetching
  let { isReady, user } = useAuth();
  user = user ? user : {};
  const { data: publisher, error: fetchError } = useSWR(isReady ? PUBLISHER_PATH : null);
  const { data: twitter, error: fetchTwitterError } = useSWR(isReady ? TWITTER_PATH : null);
  const { data: domain, error: fetchDomainError } = useSWR(isReady ? DOMAIN_PATH : null);
  
  // Publisher state
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  // UI state
  const [generateSlug, setGenerateSlug] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showingTwitter, setShowingTwitter] = useState(false);
  const [showingDomain, setShowingDomain] = useState(false);

  useEffect(() => {
    activate(injected);
  },[])

  function canDeploy() {
    return !user.eth_profile_addr && (twitter || domain)
  }

  function getTwitterCredential() {
    if (!(twitter && twitter.credential)) {
      return {};
    }
    return twitter.credential;
  }

  function getDomainCredential() {
    if (!(domain && domain.credential)) {
      return {};
    }
    return domain.credential;
  }

  // Update Publisher state on data fetch
  useEffect(() => {
    if (publisher && publisher.id) {
      setId(publisher.id);
      setName(publisher.name);
      setSlug(publisher.slug);
      if (slugIt(publisher.name) !== publisher.slug) {
        setGenerateSlug(false);
      }
    }
  }, [publisher])

  function onGenerateSlugChange(generate) {
    if (generate) {
      setSlug(slugIt(name))
    }
    setGenerateSlug(generate);
  }

  function onNameChange(newName) {
    if (generateSlug) {
      setSlug(slugIt(newName));
    }
    setName(newName);
  }
 
  async function onSubmit (e) {
    e.preventDefault()
    setSaving(true);
    const isNew = !id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? PUBLISHER_PATH : `${PUBLISHER_PATH}/${id}`;
    const data = { id, name, slug }
    try {
      const response = await api.request({ method, url, data });
      const savedPublisher = response.data;
      if (isNew) {
        setId(savedPublisher.id);
      }
      setSaving(false);
      setSuccessMsg('Profile saved successfully!');
      setTimeout(() => setSuccessMsg(''), 2000)
    } catch (err) {
      setErrorMsg(`Error saving profile: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 2000)
    }
  }

  function toggleTwitter() {
    setShowingTwitter(!showingTwitter);
  }

  function toggleDomain() {
    setShowingDomain(!showingDomain);
  }

  async function deployProfile() {
    const profileUrl = `https://profile.sourcecheck.org/${user.eth_addr}`;
    let profileAddr;
    
    // Deploy profile smart contract
    try {
      setDeploying(true);

      // Get a reference to SourceCheck Profile Factory contract
      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(SC_PROFILE_FACTORY_ADDR, SC_PROFILE_FACTORY_ABI, signer);

      // Send transaction 
      const tx = await factoryContract.createNew(user.eth_addr, SERVICE_ADDR, SERVICE_FEE_PERC, profileUrl);

      // Fetch receipt
      const receipt = await tx.wait();

      // Get profile address from receipt
      profileAddr = receipt.events[0].args[1];

    } catch (err) {
      setDeploying(false);
      setErrorMsg(`Error deploying profile: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 5000)
    }

    // Update user profile with ethereum profile address
    try {
      const method = 'POST';
      const url = UPDATE_USER_PATH;
      const data = { ethProfileAddr: profileAddr };
      await api.request({ method, url, data });
      user.eth_profile_addr = profileAddr;
      setDeploying(false);
      setSuccessMsg('Profile deployed to blockchain!');
      setTimeout(() => setSuccessMsg(''), 2000)
    } catch (err) {
      setDeploying(false);
      setErrorMsg(`Error updating profile: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 2000)
    }
  }

  return (
    <>
      <JsonModal show={showingTwitter} title="Twitter Verification" json={getTwitterCredential()} onCancel={toggleTwitter}> 
        <div className="h-14 bg-gray-100 p-2">
          <span className="mr-4">Handle:</span>
          <input 
            type="text" 
            name="username" 
            value={twitter ? twitter.username : ''}
            disabled
            className="h-10 w-72 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-md border-gray-300 rounded-md bg-gray-50" 
          />
        </div>
      </JsonModal>
      <JsonModal show={showingDomain} title="Domain Name Verification" json={getDomainCredential()} onCancel={toggleDomain}> 
        <div className="h-14 bg-gray-100 p-2">
          <span className="mr-4">Domain Name:</span>
          <input 
            type="text" 
            name="domainName" 
            value={domain ? domain.domain: ''}
            disabled
            className="h-10 w-72 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-md border-gray-300 rounded-md bg-gray-50" 
          />
        </div>
      </JsonModal>
      <NotificationPanel show={!!successMsg} message={successMsg} bgColor="bg-green-400" />
      <NotificationPanel show={!!errorMsg} message={errorMsg} bgColor="bg-red-400" />
      <Protected>
        <Layout>
          <main className="flex-1 overflow-y-auto focus:outline-none py-6" tabIndex="0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-5 md:mt-0 md:col-span-2">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <form onSubmit={onSubmit}>
                  <div className="px-4 py-5 bg-white space-y-5 sm:p-6">
                    <h1 className="text-2xl font-semibold text-gray-900">User</h1>
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                      <input 
                        type="text" 
                        name="username" 
                        value={user.username}
                        disabled
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md bg-gray-50" 
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="text" 
                        name="email" 
                        value={user.email}
                        disabled
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md bg-gray-50" 
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Publisher name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={name}
                        onChange={evt => onNameChange(evt.target.value)}
                        required
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md" 
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700"> URL-friendly publisher name (slug)</label>
                      <input type="checkbox" checked={generateSlug} onChange={() => onGenerateSlugChange(!generateSlug)}></input>
                      <label className="ml-3 text-xs inline-block" htmlFor="embedded">Auto generate </label>
                      <input 
                        type="text" 
                        name="slug" 
                        value={slug}
                        onChange={evt => setSlug(evt.target.value)}
                        required
                        disabled={generateSlug}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md" 
                      />
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  { saving ? (
                    <div className="inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md h-10 w-20 bg-indigo-600 hover:bg-indigo-700">
                      <PulseLoader color="white" loading={saving} size={9} /> 
                    </div>
                  ) : (
                    <button type="submit" className="h-10 w-20 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Save
                    </button>
                  )}
                  </div>
                </form>
              </div>
              <div className="shadow sm:rounded-md sm:overflow-hidden mt-6">
                <div className="px-4 py-5 bg-white space-y-5 sm:p-6">
                  <h1 className="text-2xl font-semibold text-gray-900">Verifiable Credentials</h1>
                  <div className={`${user.eth_profile_addr ? '' : 'hidden'} col-span-6 sm:col-span-4`}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Verified Profile Contract Address</label>
                    <input 
                      type="text" 
                      name="profileAddr" 
                      value={user.eth_profile_addr}
                      onChange={evt => setName(evt.target.value)}
                      required
                      disabled
                      className="mt-1 text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md" 
                    />
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th scope="col" className="px-6 py-2 ">Name</th>
                        <th scope="col" className="px-6 py-2 ">Status</th>
                        <th scope="col" className="px-2 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-md">
                      <tr className={`text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 group`} >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <div className="flex items-center">
                            <svg className="flex-none w-10 h-12 mr-3 sm:w-4 sm:h-4" width="25" height="20" viewBox="0 0 32 32">
                              <path d="M31.0934 8.58666C31.1883 8.5078 31.2594 8.40417 31.2989 8.28728C31.3384 8.1704 31.3446 8.04485 31.317 7.92461C31.2894 7.80438 31.2289 7.69417 31.1423 7.60626C31.0558 7.51835 30.9465 7.45618 30.8267 7.42666L29.7734 7.16C29.6776 7.13602 29.5884 7.09107 29.5121 7.02839C29.4358 6.96571 29.3744 6.88687 29.3323 6.79757C29.2902 6.70826 29.2685 6.61072 29.2687 6.51199C29.2688 6.41326 29.291 6.3158 29.3334 6.22666L29.9201 5.04C29.9755 4.92501 29.9967 4.79652 29.9813 4.66981C29.9658 4.54311 29.9143 4.4235 29.8329 4.32521C29.7514 4.22691 29.6435 4.15407 29.5219 4.11533C29.4002 4.07659 29.27 4.07358 29.1467 4.10666L26.4801 4.85333C26.3807 4.88231 26.276 4.88776 26.1742 4.86924C26.0723 4.85073 25.9762 4.80876 25.8934 4.74666C24.7394 3.88118 23.3359 3.41333 21.8934 3.41333C20.1253 3.41333 18.4296 4.11571 17.1794 5.36595C15.9291 6.61619 15.2267 8.31189 15.2267 10.08V10.56C15.2273 10.6419 15.1978 10.7211 15.1437 10.7826C15.0896 10.8441 15.0147 10.8835 14.9334 10.8933C11.1867 11.3333 7.60008 9.42666 3.73341 4.97333C3.64941 4.88069 3.5415 4.81301 3.42153 4.77772C3.30156 4.74244 3.17419 4.74092 3.05341 4.77333C2.9446 4.82334 2.85128 4.90174 2.78324 5.00028C2.7152 5.09882 2.67496 5.21386 2.66674 5.33333C2.13269 7.52712 2.34861 9.83656 3.28008 11.8933C3.30764 11.9479 3.31967 12.009 3.31485 12.0699C3.31004 12.1308 3.28857 12.1893 3.25278 12.2388C3.217 12.2884 3.16828 12.3271 3.11195 12.3508C3.05563 12.3746 2.99386 12.3823 2.93341 12.3733L1.44007 12.08C1.33402 12.0629 1.22542 12.0718 1.12352 12.1057C1.02161 12.1397 0.92942 12.1978 0.854788 12.275C0.780157 12.3523 0.725296 12.4464 0.694876 12.5494C0.664456 12.6524 0.659378 12.7613 0.680075 12.8667C0.795193 13.8899 1.13897 14.8742 1.68597 15.7466C2.23296 16.619 2.96916 17.3573 3.84008 17.9067C3.89643 17.934 3.94396 17.9766 3.97722 18.0296C4.01047 18.0827 4.02811 18.144 4.02811 18.2067C4.02811 18.2693 4.01047 18.3306 3.97722 18.3837C3.94396 18.4368 3.89643 18.4794 3.84008 18.5067L3.13341 18.7867C3.04759 18.8211 2.96986 18.873 2.90517 18.939C2.84048 19.0051 2.79024 19.0839 2.75764 19.1704C2.72503 19.2569 2.71079 19.3493 2.7158 19.4416C2.72081 19.5339 2.74497 19.6242 2.78674 19.7067C3.17753 20.5618 3.76988 21.3093 4.51301 21.8853C5.25613 22.4612 6.12785 22.8483 7.05341 23.0133C7.11776 23.0367 7.17336 23.0793 7.21265 23.1354C7.25194 23.1914 7.27302 23.2582 7.27302 23.3267C7.27302 23.3951 7.25194 23.4619 7.21265 23.518C7.17336 23.574 7.11776 23.6166 7.05341 23.64C5.24056 24.3898 3.29509 24.7662 1.33341 24.7467C1.1566 24.7113 0.97298 24.7476 0.822951 24.8476C0.672922 24.9477 0.56877 25.1032 0.533408 25.28C0.498046 25.4568 0.53437 25.6404 0.634389 25.7905C0.734409 25.9405 0.88993 26.0446 1.06674 26.08C4.46347 27.691 8.16165 28.5678 11.9201 28.6533C15.226 28.7038 18.4731 27.776 21.2534 25.9867C23.5404 24.4601 25.4141 22.3913 26.7076 19.9649C28.0011 17.5384 28.6741 14.8297 28.6667 12.08V10.92C28.6676 10.8232 28.6895 10.7277 28.7309 10.6402C28.7723 10.5527 28.8324 10.4753 28.9067 10.4133L31.0934 8.58666Z" fill="black"></path>
                            </svg>
                            <span>Twitter Account Verification</span>
                          </div>
                        </td>
                        { twitter ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-block px-2 py-1 bg-green-100 text-sm text-green-500 rounded-md">Complete</span>
                            </td>
                            <td className="pr-2 py-4 whitespace-nowrap text-right">
                              <a onClick={toggleTwitter} className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer">Show</a>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-block px-2 py-1 bg-red-100 text-sm text-red-500 rounded-md">Incomplete</span>
                            </td>
                            <td className="pr-2 py-4 whitespace-nowrap text-right">
                              <a href="https://profile.sourcecheck.org/twitter-verification">
                                <span className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer">Verify</span>
                              </a>
                            </td>
                          </>
                        )}
                      </tr>
                      <tr className={`text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 group`} >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <div className="flex items-center">
                            <svg className="flex-none mr-3" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M9 1.63636C4.93318 1.63636 1.63636 4.93318 1.63636 9C1.63636 13.0668 4.93318 16.3636 9 16.3636C13.0668 16.3636 16.3636 13.0668 16.3636 9C16.3636 4.93318 13.0668 1.63636 9 1.63636ZM0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="black"></path><path fillRule="evenodd" clipRule="evenodd" d="M0 9C0 8.44772 0.366312 8 0.818182 8H17.1818C17.6337 8 18 8.44772 18 9C18 9.55228 17.6337 10 17.1818 10H0.818182C0.366312 10 0 9.55228 0 9Z" fill="black"></path><path fillRule="evenodd" clipRule="evenodd" d="M6.60019 8.86481C6.65501 11.4184 7.501 13.8768 9 15.8816C10.499 13.8768 11.345 11.4184 11.3998 8.86481C11.345 6.31124 10.499 3.85278 9 1.84798C7.501 3.85278 6.65501 6.31124 6.60019 8.86481ZM9 0.560089L8.40932 0C6.27751 2.42276 5.06601 5.56688 5.00017 8.84751C4.99994 8.85904 4.99994 8.87058 5.00017 8.88211C5.06601 12.1627 6.27751 15.3069 8.40932 17.7296C8.56089 17.9019 8.77526 18 9 18C9.22474 18 9.43911 17.9019 9.59068 17.7296C11.7225 15.3069 12.934 12.1627 12.9998 8.88211C13.0001 8.87058 13.0001 8.85904 12.9998 8.84751C12.934 5.56688 11.7225 2.42276 9.59068 0L9 0.560089Z" fill="black"></path>
                            </svg>
                            <span>Web Domain Verification</span>
                          </div>
                        </td>
                        { domain ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-block px-2 py-1 bg-green-100 text-sm text-green-500 rounded-md">Complete</span>
                            </td>
                            <td className="pr-2 py-4 whitespace-nowrap text-right">
                              <a onClick={toggleDomain} className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer">Show</a>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-block px-2 py-1 bg-red-100 text-sm text-red-500 rounded-md">Incomplete</span>
                            </td>
                            <td className="pr-2 py-4 whitespace-nowrap text-right">
                              <a href="https://profile.sourcecheck.org/domain-verification">
                                <span className="text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer">Verify</span>
                              </a>
                            </td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div> 
              </div>
            </div>
          </main>
        </Layout>
      </Protected>
    </>
  );
}
