import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth';
import Link from 'next/link'
import Cookie from 'js-cookie';
import api from '../lib/api';
import PulseLoader from 'react-spinners/PulseLoader';
import NavBar from '../components/NavBar';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const SIGNIN_PATH = process.env.NEXT_PUBLIC_SIGNIN_PATH;
const SIGNIN_URL = `${API_HOST}${SIGNIN_PATH}`;

export default function SignIn() {
  const { setUser } = useAuth();
  const router = useRouter()

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle sign in
  async function signIn(evt) {
    evt.preventDefault();
    setError(false);
    setLoading(true);
    const res = await fetch(SIGNIN_URL, {
      body: JSON.stringify({ identifier, password }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const result = await res.json();
    setLoading(false);
    if (result.statusCode && result.statusCode !== 200) {
      setError(true);
      setErrorMessage(JSON.stringify(result.data[0].messages[0].message));
    } else {
      Cookie.set('token', result.jwt);
      api.defaults.headers.Authorization = `Bearer ${result.jwt}`;
      setUser(result.user);
      router.push('/profile');
    }
  }

  return (
    <>
      <NavBar />
      <div className="max-w-7xl px-5 mt-5 mx-auto">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            {
              error ? (
                <div className="md:col-span-1 px-3">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Sign In</h3>
                    <p className="mt-1 text-sm text-gray-600">ERROR! There was a problem during your sign in: {errorMessage}</p>
                  </div>
                </div>
              ) : (
                <div className="md:col-span-1 px-3">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Sign In</h3>
                    <p className="mt-1 text-sm text-gray-600">Please fill in your username or email and your password</p>
                  </div>
                </div>
              )
            }
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={signIn}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 space-y-3 sm:p-6 bg-white">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Username or email</label>
                      <input
                        id="identifier"
                        type="text"
                        name="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      <>
                        <button type="submit" className="inline-block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Sign-In
                        </button>
                        <div>
                          <div className="inline-block text-indigo-600 text-xs mt-2 hover:underline cursor-pointer">
                            <Link href="/forgot-password"><a>Forgot Password?</a></Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
