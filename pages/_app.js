import '../styles/global.css'
import { fetcher } from '../lib/api';
import { SWRConfig } from 'swr';
import { AuthProvider } from '../context/auth';
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from '@web3-react/core'
import MenuOpenedContextProvider from '../context/MenuOpenedContext';

function getLibrary(provider) {
  return new Web3Provider(provider);
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
