import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuth } from '../context/auth';
import Layout from '../components/AppLayout';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated]);

  return (
    <Layout>
      <main className="flex-1 overflow-y-auto focus:outline-none py-6" tabIndex="0">
        <div className="max-w-5xl mx-auto bg-gray-100 p-8">
          <h1 className="text-3xl">HonorBox</h1>

          <div className="flex flex-row space-x-3 my-3">
            <div>
              <span>
                HonorBox is a self-service tool for self-publishing eBooks, pamphlets, artworks, and other material in PDF format with a special page added at the end containing a link to a completely free, verified identity that you control-- which includes a unique cryptocurrency payment address.<br/><br/>
                This allows people who want to support your work, donate to your cause, or otherwise "send you money" to trust that you will receive the money they send! <br/><br/>
                Over time, we will allow more kinds of payments and more kinds of verification. We also allow automatic distribution of funds, i.e. "revenue sharing" or "automatic royalty payments" for maximum transparency.
              </span>
            </div>
          </div>
          <div className="flex flex-row space-x-3 my-3">
            <div>
              <span>
                To create your profile and payment address, go to <a className="text-indigo-500 hover:text-indigo-600" href="https://profile.sourcecheck.org" target="_blank">profile.sourcecheck.org</a> and create a profile.<br/><br/>
                Come back here afterwards and sign in with the same cryptocurrency wallet and address, and we'll add the payment information to your PDF so you can distribute it far and wide!  If you are interested in protecting your content against copyright infringement, you might also want to register it with our friends at <a className="text-indigo-500 hover:text-indigo-600" href="https://licium.app" target="_blank">Licium</a>.
              </span>
            </div>
          </div>
          <div className="flex flex-row space-x-3 my-3">
            <div>
              <span>
                Who are we and why should you trust us, you might be asking? We are a co-operative called <a className="text-indigo-500 hover:text-indigo-600" href="https://sourcecheck.org" target="_blank">SourceCheck</a>, and we are devoted to advancing decentralized identity, decentralized content authenticity, and decentralization in general to create a more equitable future for all forms of content and publishing. We charge a small transaction fee of 2% on donations sent through the profiles we host, and are otherwise sustained by grants and donations.<br/><br/>
                Feel free to send us donations directly if you'd like to support our work!
              </span>
            </div>
          </div>
          <div className="flex flex-row space-x-3 my-3">
            <div>
              <span>
                Ethereum address for donations:<br/>
                Polygon address for donations: <span className="font-bold">0x639872CbfB6c00B2c13e1BBC81147594b1c3c79e</span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
