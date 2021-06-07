import '../styles/global.css'
import { SWRConfig } from 'swr';
import { AuthProvider } from '../context/auth';
import { fetcher } from '../lib/api';

function MyApp({ Component, pageProps }) {
  
return (
    <SWRConfig value={{ fetcher: fetcher }} >
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
