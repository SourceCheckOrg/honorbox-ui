import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { useAuth } from '../context/auth';
import Cookie from 'js-cookie';
import NavBar from '../components/NavBar'
import api from '../lib/api';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const SIGNUP_VERIFICATION_PATH = process.env.NEXT_PUBLIC_SIGNUP_VERIFICATION_PATH;
const SIGNUP_VERIFICATION_URL=`${API_HOST}${SIGNUP_VERIFICATION_PATH}`;

export default function EmailConfirmation() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
    
  const { confirmationToken } = router.query;
  if (confirmationToken && confirmationToken !== token) {
    setToken(confirmationToken);
  }

  // Listen to events related to client token
  useEffect(() => {
    async function verifyEmail() {
      setLoading(true);
      console.log('token', token);
      const res = await fetch(SIGNUP_VERIFICATION_URL, {
        body: JSON.stringify({ confirmationToken: token }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const result = await res.json();
      if (result.jwt) {
        Cookie.set('token', result.jwt);
        api.defaults.headers.Authorization = `Bearer ${result.jwt}`;
        setUser(result.user);
        router.push('/profile');
      }
      setLoading(false);
    }
    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <>
      <NavBar />
      <div className="max-w-7xl px-5 mt-5 mx-auto">
      <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1 px-3">
              <div className="px-4 sm:px-0">
                <h3 className="text-xl font-medium leading-6 text-gray-900">Email confirmation</h3>
                <p className="mt-1 text-sm text-gray-600">Your email is being verified and you will be redirected to the home page after</p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 px-7" >
              Verifying your email address!              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
