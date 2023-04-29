import React, {useCallback, useEffect, useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

const [movies, setMovies] = useState([]);

const [ isLoading, setIsLoading] = useState(false);

const [error, setError] = useState(null);

const [ cancelRetry, setCancelRetry] = useState(false);

const fetchMoviesHandler = useCallback(async (retries = 0) => {
  try {
    setIsLoading(true);
    setError(null);
    const response = await fetch("https://swapi.dev/api/films/");
    if (!response.ok) {
      if (retries < 5 && !cancelRetry) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return fetchMoviesHandler(retries + 1);
      } else {
        throw new Error("Something went wrong ....Retrying");
      }
    }
    const data = await response.json();

    const transformedMovies = data.results.map((movieData) => ({
      id: movieData.episode_id,
      title: movieData.title,
      openingText: movieData.opening_crawl,
      releaseDate: movieData.release_date,
    }));
    setMovies(transformedMovies);
    setIsLoading(false);
  } catch (error) {
    setError(error.message);
    setIsLoading(false);
  }
}, [cancelRetry]);

useEffect(()=>{
  fetchMoviesHandler();
}, [fetchMoviesHandler, cancelRetry]);

  const handleCancelRetry = useCallback(() => {
    setCancelRetry(true);
  },[]);


return (
  <React.Fragment>
    <section>
    {isLoading && <p>Loading...</p>}
     {!isLoading && movies.length>0 && <MoviesList movies={movies} />}
     {!isLoading && movies.length ===0 && !error && <p>Found No Movies....</p>}
     {!isLoading && error && <p>{error}</p>}
     {!isLoading && (
      <button onClick={handleCancelRetry}>Cancel Retry</button>
     )}
     
     
    </section>
  </React.Fragment>
);

}

export default App;