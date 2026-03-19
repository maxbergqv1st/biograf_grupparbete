import { StrictMode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import '../i18n';
import App from './App';
import { queryClient } from './api/queryClient';
import UnderDevelopment from './components/custom/UnderDevelopment';
import './index.css';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import CancelBookingPage from './pages/CancelBookingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MobileMovieDetailsPage from './pages/MobileMovieDetailsPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import OffersPage from './pages/OffersPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyTicketsPage from './pages/MyTicketsPage';
import SeatsPage from './pages/SeatsPage';
import SignUpPage from './pages/SignUpPage';
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
      {
        path: 'mmovies/:id',
        element: <MobileMovieDetailsPage />,
        ...(IS_V1 && { loader: moviesLoader }),
      },
      { path: 'admin', element: <AdminPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'seats', element: <SeatsPage /> },
      { path: 'offers', element: <OffersPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'my-bookings', element: <MyBookingsPage /> },
      { path: 'my-tickets', element: <MyTicketsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'cancel-booking', element: <CancelBookingPage /> },
      {
        path: 'social-login',
        element: <UnderDevelopment fullPage feature="Social login" />,
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
