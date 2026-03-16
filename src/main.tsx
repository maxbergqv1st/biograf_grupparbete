import { StrictMode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import '../i18n';
import App from './App';
import { queryClient } from './api/queryClient';
import LoginModal from './components/auth/LoginModal';
import './index.css';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import SeatsPage from './pages/SeatsPage';
import moviesLoader from './utils/movieLoader';

const IS_V1 = import.meta.env.VITE_API_VERSION !== 'v2';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
        ...(IS_V1 && { loader: moviesLoader }),
      },
      {
        path: 'movies/:id',
        element: <MovieDetailsPage />,
        ...(IS_V1 && { loader: moviesLoader }),
      },
      { path: 'admin', element: <AdminPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'seats', element: <SeatsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <LoginModal />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
