import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import QRCode from 'qrcode.react';
import socketIoClient from 'socket.io-client';
import { v4 as uuidv4} from 'uuid';
import { useAuth } from '../context/auth';
import api from '../lib/api';
import NavBar from '../components/NavBar';

const API_HOST=process.env.NEXT_PUBLIC_API_HOST;
const SSI_SIGNIN_PATH=process.env.NEXT_PUBLIC_SSI_SIGNIN_PATH;
const SSI_SIGNIN_URL=`${API_HOST}${SSI_SIGNIN_PATH}`;

export default function SignIn() {
  const { setUser } = useAuth();
  const [challenge, setChallenge] = useState()
  const router = useRouter()
 
  // Create socket on component mount
  useEffect(() => {

    let uuid = uuidv4()
    setChallenge(uuid)

    let socket = socketIoClient(API_HOST);
    
    socket.on('hello', data => {
      console.log('Socked connection established: ', data);
    });

    // TODO handle sign in errors (like user not registered etc)

    socket.on('auth', auth => {
      Cookie.set('token', auth.jwt);
      api.defaults.headers.Authorization = `Bearer ${auth.jwt}`;
      setUser(auth.user);
      router.push('/profile');
    });

    socket.emit('client-token-sub', uuid);

    return () => {
      socket.disconnect()
    }
  }, []);

  const url = `${SSI_SIGNIN_URL}?challenge=${challenge}`;

  return (
    <>
      <NavBar />
      <div className="max-w-7xl px-5 mt-5 mx-auto">
      <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1 px-3">
              <div className="px-4 sm:px-0">
                <h3 className="text-xl font-medium leading-6 text-gray-900">Sign In</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Please scan the QR code using your verified Credible wallet 
                    to sign in to your account securely and authenticate yourself.</p>
                <p className="mt-1 text-sm text-gray-600">
                    Note: we require this extra step to ensure each session with our system
                    has a fresh signature from the wallet that contains and controls
                    the verification token you received at sign-up.</p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 px-7" >
              <QRCode
                id={challenge}
                value={url}
                size={200}
                level={"H"}
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
