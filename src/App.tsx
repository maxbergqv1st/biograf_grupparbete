import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import RootLayout from '@/components/RootLayout';

export default function App() {
  const { pathname } = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return <RootLayout />;
}
