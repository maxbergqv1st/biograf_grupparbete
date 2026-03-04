import { StrictMode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import type { RouteObject } from 'react-router-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App';
import { queryClient } from './api/queryClient';
import './i18n';
import './index.css';
import routes from './routes';

// Create a router using settings/content from 'routes.tsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes as RouteObject[],
    HydrateFallback: App,
  },
]);

// Create the React root element
createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
