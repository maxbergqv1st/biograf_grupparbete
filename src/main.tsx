import { StrictMode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import '../i18n';
import App from './App';
import { queryClient } from './api/queryClient';
import './index.css';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import SeatsPage from './pages/SeatsPage';
import UnderDevelopment from './components/custom/UnderDevelopment';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import CancelBookingPage from './pages/CancelBookingPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
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
      { path: 'signup', element: <SignUpPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'cancel-booking', element: <CancelBookingPage /> },
      { path: 'social-login', element: <UnderDevelopment fullPage feature="Social login" /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
