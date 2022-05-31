import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { cart } from '../modules/carts';
import { getCart } from '../modules/common/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const initialize = async () => {
  const data = await getCart().catch(() => {});
  if (!data) return;
  const count = data.items.reduce((c, item) => c + item.qty, 0);
  cart.update(count);
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ToastContainer
        position='bottom-left'
        hideProgressBar
        autoClose={2000}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
