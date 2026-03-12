import { createElement } from 'react';

import type Route from './interfaces/Route.ts';
import Booking from './pages/BookingPage.tsx';
import LandingPage from './pages/LandingPage.tsx';
import MovieDetailsPage from './pages/MovieDetailsPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import Seat from './pages/Seats.tsx';

export default [NotFoundPage, MovieDetailsPage, LandingPage, Seat, Booking]
  // map the route property of each page component to a Route
  .map((x) => ({ element: createElement(x), ...x.route }) as Route)
  // sort by index (and if an item has no index, sort as index 0)
  .sort((a, b) => (a.index || 0) - (b.index || 0));
