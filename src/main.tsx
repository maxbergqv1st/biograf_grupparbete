import { StrictMode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import App from './App';
import { queryClient } from './api/queryClient';
import LoginModal from './components/auth/LoginModal';
import './i18n';
import './index.css';
import BookingPage from './pages/BookingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import SeatsPage from './pages/SeatsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies/:id', element: <MovieDetailsPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'seats', element: <SeatsPage /> },
      { path: '/login', element: <LoginPage /> },
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
