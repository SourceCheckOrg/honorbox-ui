import '../styles/global.css'
import { SWRConfig } from 'swr';
import { ethers } from "ethers";
import { Web3ReactProvider } from '@web3-react/core'
import { fetcher } from '../lib/api';
import { AuthProvider } from '../context/auth';
import MenuOpenedContextProvider from '../context/MenuOpenedContext';

function getLibrary() {
  return new ethers.providers.Web3Provider(window.ethereum); 
}

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher: fetcher }} >
      <Web3ReactProvider getLibrary={getLibrary}>
        <AuthProvider>
          <MenuOpenedContextProvider>
            <Component {...pageProps} />
          </MenuOpenedContextProvider>
        </AuthProvider>
      </Web3ReactProvider>
    </SWRConfig>
  );
}

export default MyApp;
