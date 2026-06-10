import '@/styles/globals.css';
import '@/styles/admin.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AdminProvider } from '@/context/AdminContext';
import { PortfolioDataProvider } from '@/context/PortfolioDataContext';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { useTheme } from '@/context/ThemeContext';
import Cursor from '@/components/ui/Cursor';
import PageTransition from '@/components/ui/PageTransition';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function AppToaster() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isDark ? '#1a1f2e' : '#ffffff',
          color: isDark ? '#e2e8f0' : '#111827',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
        },
      }}
    />
  );
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <AdminProvider>
          <PortfolioDataProvider>
            <Cursor />
            <PageTransition>
              {getLayout(<Component {...pageProps} />)}
            </PageTransition>
            <AppToaster />
            <Analytics />
          </PortfolioDataProvider>
        </AdminProvider>
      </ThemeProvider>
    </>
  );
}
