import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useAuth } from '../context/auth';
import NavBar from '../components/NavBar';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated]);

  return (
    <>
      <NavBar />
      <div className="p-8">
        <div className="bg-white overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            
            <div className="text-lg max-w-prose mx-auto">
              <h1>
                <span className="block text-base text-center text-gray-900 font-semibold tracking-wide uppercase">Welcome to the</span>
                <span className="mt-2 block text-3xl text-center leading-8 font-medium tracking-tight text-gray-900 sm:text-4xl">HonorBox prototype</span>
              </h1>
              <div className="mt-8 text-xl text-gray-500 leading-8">
                <p>This prototype demonstrates how the HonorBox platform can be used to 
                generate unique, per-publication revenue-sharing smart contracts and 
                attach those to PDF files for direct payments.</p>
                <br/>
                <p>We even have code for detecting, extracting, and verifying signatures on 
                the W3C Verifiable Credentials that describe all of these operations, 
                to make them more trustworthy.</p>
                <br/>
                <p>Proposed future features include: </p>
                <br/>
                <ul className="pl-7 list-disc">
                  <li>Binding publisher identities to Twitter account control proofs, 
                    long-lived blockchain addresses, or other proofs of authenticity</li>
                  <li>Support for more wallets and protocols for managing publications
                    and taking that data elsewhere in the form of Verifiable Credentials</li>
                  <li>Support for more blockchain address types for revenue-sharing contracts</li>
                </ul>
                <br/>
                <p>We currently use the <a className="underline text-indigo-600 hover:text-indigo-800" href="https://spruceid.dev/docs/credible/">
                Credible wallet</a> from <a className="underline text-indigo-600 hover:text-indigo-800" href="https://spruceid.com/">Spruce 
                Systems</a>, USA, to handle log-in to our custom publisher app (UI). Please download the 
                wallet from <a className="underline text-indigo-600 hover:text-indigo-800" href="https://play.google.com/store/apps/details?id=com.spruceid.app.credible">
                Android store</a> or the iOS app store (coming soon) and  <Link href="/sign-up"><a className="underline text-indigo-600 hover:text-indigo-800" >Sign Up</a>
                </Link> to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
