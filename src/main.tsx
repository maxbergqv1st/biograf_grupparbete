import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import type { RouteObject } from 'react-router-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import '../sass/index.scss';
import App from './App';
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
    <RouterProvider router={router} />
  </StrictMode>,
);
