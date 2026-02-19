import { useState } from 'react';

import { useLocation } from 'react-router-dom';

import type { Movie } from './interfaces/Interfaces';
import Footer from './partials/Footer';
import Header from './partials/Header';
import Main from './partials/Main';
import useFetchJson from './utilities/useFetchJson';

export default function App() {
  // scroll to top when the route changes
  useLocation();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  const [movies] = useFetchJson<Movie[]>('/api/movie');
  const [showMovies, setShowMovies] = useState(false);

  return (
    <>
      <Header />
      <Main />
      <button onClick={() => setShowMovies(!showMovies)}>
        {showMovies ? 'Hide Movies' : 'Show Movies'}
      </button>
      {showMovies && movies && (
        <section>
          {movies.map((movie) => (
            <article key={movie.id}>
              <h3>{movie.title}</h3>
              <p>{movie.description_short}</p>
              <hr />
            </article>
          ))}
        </section>
      )}
      <Footer />
    </>
  );
}
