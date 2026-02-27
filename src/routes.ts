import { createElement } from 'react';

import type Route from './interfaces/Route.ts';
import AboutPage from './pages/AboutPage.tsx';
import LandingPage from './pages/LandingPage.tsx';
import MovieDetailsPage from './pages/MovieDetailsPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import OurVisionPage from './pages/OurVisionPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage.tsx';
import ProductsPage from './pages/ProductsPage.tsx';

export default [
  AboutPage,
  NotFoundPage,
  OurVisionPage,
  ProductDetailsPage,
  ProductsPage,
  MovieDetailsPage,
  LandingPage,
]
  // map the route property of each page component to a Route
  .map((x) => ({ element: createElement(x), ...x.route }) as Route)
  // sort by index (and if an item has no index, sort as index 0)
  .sort((a, b) => (a.index || 0) - (b.index || 0));
