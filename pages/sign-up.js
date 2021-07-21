import { useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import NavBar from '../components/NavBar';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const SIGNUP_PATH = process.env.NEXT_PUBLIC_SIGNUP_PATH;
const SIGNUP_URL = `${API_HOST}${SIGNUP_PATH}`;

export default function SignUp() {

  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [sucess, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle sign up
  async function signUp(evt) {
    evt.preventDefault();
    setLoading(true);
    let result;
    const res = await fetch(SIGNUP_URL, {
      body: JSON.stringify({ username, email }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    result = await res.json();
    setLoading(false);
    if (result.statusCode && result.statusCode !== 200) {
      setError(true);
      setErrorMessage(JSON.stringify(result.message));
    } else {
      setSuccess(true);
    }
  }

  if (sucess) {
    return (
      <>
        <NavBar />
        <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 md:gap-6 p-5 md:px-10">
          <div className="md:col-span-1 text-gray-600 text-l">
            <h1 className="text-2xl text-gray-900">Sign Up</h1>
            <p className="pt-5">We have sent you an email message containing instructions to activate your account!</p>
            <p className="pt-5">
              If you don't see it for 5min, check your email spam filter. 
              It will contain a unique URL to confirm your email, which takes you to a QR code to scan with your 
              SSI mobile wallet, which will handle electronic signatures securely and confidentially.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 md:gap-6 p-5 md:px-10">
          <div className="md:col-span-1 text-gray-600 text-l">
            <h1 className="text-2xl text-gray-900">Sign Up</h1>
            <p className="pt-5">There was a problem processing your request: {errorMessage}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 md:gap-6 p-5 md:px-10">
        <div className="md:col-span-1 text-l text-gray-600">
          <h1 className="text-2xl text-gray-900">Sign Up instructions</h1>
          <p className="pt-5">We are going to send you an email message with information on how to continue</p>
          <p className="pt-5">
            If you don't see it for 5min, check your email spam filter. 
            It will contain a unique URL to confirm your email, which takes you to a QR code to scan with your 
            SSI mobile wallet, which will handle electronic signatures securely and confidentially.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={signUp}>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 space-y-4 bg-white sm:p-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="username"className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
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
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign-Up
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
