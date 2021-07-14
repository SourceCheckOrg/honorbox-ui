import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuth } from '../context/auth';
import NavBar from '../components/NavBar';

//I noticed the VSC linter was freaking out if i defined <a href= links manually,
//so just did it as string variables instead; maybe there's a better way?

//this should probably declared elsewhere as a global, but my JS is very rusty,
//could you move it to the appropropriate place and import it instead?
//maybe an array of links like links['credibleDownload'], 
//links['contact us'] makes more sense, for centralizing them in one file?
const credibleLink = "<a href=https://spruceid.dev/docs/Credible/>Credible wallet</a>";
const spruceLink = "<a href=https://spruceid.com/>Spruce Systems</a>";
const credibleDownload = "<a href=https://play.google.com/store/apps/details?id=com.spruceid.app.credible>Android store</a>";

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
    <div className="max-w-7xl px-5 mt-5 mx-auto">
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1 px-3">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Welcome the HonorBox prototype</h3>
            <p className="mt-1 text-sm text-gray-600">
              This prototype demonstrates how the HonorBox platform can be used to 
              generate unique, per-publication revenue-sharing smart contracts and 
              attach those to PDF files for direct payments. 
              We even have code for detecting, extracting, a verifying signatures on 
              the W3C Verifiable credentials that describe all of these operations, 
              to make them more trustworthy.  Proposed future features include: 
              <ul> 
                  <li>Binding publisher identities to Twitter account control proofs, 
                    long-lived blockchain addresses, or other proofs of authenticity</li> 
                  <li>Support for more wallets and protocols for managing publications
                    and taking that data elsewhere in the form of Verifiable Credentials</li>
                  <li>Support for more blockchain address types for revenue-sharing contracts</li>
              </ul>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              We currently use the {credibleLink}
              from {spruceLink}, USA, to handle 
              log-in to our custom, Strapi-powered publisher interface. Please 
              download the wallet from {credibleDownload} 
              or the iOS app store (coming soon) and use the \"sign up\" button above \
              to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </>
  );

}
