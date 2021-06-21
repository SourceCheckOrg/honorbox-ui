import { useState } from 'react';
import { useRouter } from 'next/router';
import PulseLoader from 'react-spinners/PulseLoader';
import NavBar from '../components/NavBar';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const RESET_PASSWORD_PATH = process.env.NEXT_PUBLIC_RESET_PASSWORD_PATH
const RESET_PASSWORD_URL = `${API_HOST}${RESET_PASSWORD_PATH}`;

export default function ResetPassword() {
  // Form state
  const [resetCode, setResetCode] = useState();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  // Get code from URL query param and store it in state
  const router = useRouter();
  const { code } = router.query;
  if (code && code !== resetCode) {
    setResetCode(code);
  }

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle reset password
  async function handleResetPassword(evt) {
    evt.preventDefault();
    setError(false);
    setLoading(true);
    const res = await fetch(RESET_PASSWORD_URL, {
      body: JSON.stringify({ code: resetCode, password, passwordConfirmation }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const result = await res.json();
    setLoading(false);
    if (result.statusCode && result.statusCode !== 200) {
      setError(true);
      setErrorMessage(JSON.stringify(result.data[0].messages[0].message));
    } else {
      router.push('/sign-in');
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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Reset Password</h3>
                    <p className="mt-1 text-sm text-gray-600">ERROR! There was a problem resetting your password: {errorMessage}</p>
                  </div>
                </div>
              ) : (
                <div className="md:col-span-1 px-3">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Reset Password</h3>
                    <p className="mt-1 text-sm text-gray-600">Enter your new password and confirm it</p>
                  </div>
                </div>
              )
            }
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleResetPassword}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 space-y-3 sm:p-6 bg-white">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">New password</label>
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
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">Password confirmation</label>
                      <input
                        id="passwordConfirmation"
                        type="password"
                        name="passwordConfirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                          Reset Password
                        </button>
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
