import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router'
import Cookie from 'js-cookie';
import QRCode from 'qrcode.react';
import socketIoClient from 'socket.io-client';
import NavBar from '../components/NavBar'

const API_HOST=process.env.NEXT_PUBLIC_API_HOST;
const SSI_SIGNUP_PATH=process.env.NEXT_PUBLIC_SSI_SIGNUP_PATH;
const SSI_SIGNUP_URL=`${API_HOST}${SSI_SIGNUP_PATH}`;

export default function EmailConfirmation() {
  const [socket, setSocket] = useState()
  const [token, setToken] = useState()
  const router = useRouter();
  
  const { confirmation } = router.query;
  if (confirmation && confirmation !== token) {
    setToken(confirmation);
  }

  // Create socket on component mount
  useEffect(() => {
    let newSocket = socketIoClient(API_HOST);
    
    newSocket.on('hello', data => {
      console.log('received hello server: ', data)
    });

    newSocket.on('jwt', jwt => {
      Cookie.set('token', jwt);
      Router.push('/');
    });

    // TODO handle sign-up errors (like problems with VP)

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, []);

  // Listen to events related to client token
  useEffect(() => {
    if (token) {
      socket.emit('client-token-sub', token);
    }
  }, [token]);

  const url = `${SSI_SIGNUP_URL}?confirmationToken=${confirmation}`;
  
  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 md:gap-6 p-5 md:px-10">
        <div className="md:col-span-1">
          <div className="text-gray-600 text-l">
            <h1 className="text-2xl text-gray-900">Email confirmation</h1>
            <p className="pt-5">
              Please scan the QR code using your Credible Wallet to associate your 
              verified email address with a unique signing key controlled exclusively 
              and confidentially on your mobile device. A unique token will be stored in
              your wallet associated with this account.
            </p>
          </div>
        </div>
        <div className="md:col-span-2 pt-10 md:pt-14 md:pl-10" >
          <QRCode
            id={confirmation}
            value={url}
            size={200}
            level={'H'}
            includeMargin={false}
          />
        </div>
      </div>
    </>
  )
}
