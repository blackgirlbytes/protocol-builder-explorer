import { ProtocolProvider } from '@/context/ProtocolContext';

function MyApp({ Component, pageProps }) {
  return (
    <ProtocolProvider>
      <Component {...pageProps} />
    </ProtocolProvider>
  );
}

export default MyApp;