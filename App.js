import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelRetry, setCancelRetry] = useState(false);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieOpeningText, setNewMovieOpeningText] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState("");

  const fetchMoviesHandler = useCallback(
    async (retries = 0) => {
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
    },
    [cancelRetry]
  );

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler, cancelRetry]);

  const handleCancelRetry = useCallback(() => {
    setCancelRetry(true);
  }, []);

  const handleNewMovieTitle = useCallback((event) => {
    setNewMovieTitle(event.target.value);
  }, []);

  const handleNewMovieOpeningText = useCallback((event) => {
    setNewMovieOpeningText(event.target.value);
  }, []);

  const handleNewMovieReleaseDate = useCallback((event) => {
    setNewMovieReleaseDate(event.target.value);
  }, []);

  const handleAddMovie = useCallback(() => {
    const newMovie = {
      id: movies.length + 1,
      title: newMovieTitle,
      openingText: newMovieOpeningText,
      releaseDate: newMovieReleaseDate,
    };
    console.log(newMovie);
    setMovies((prevMovies) => [...prevMovies, newMovie]);
    setNewMovieTitle("");
    setNewMovieOpeningText("");
    setNewMovieReleaseDate("");
  }, [movies.length, newMovieTitle, newMovieOpeningText, newMovieReleaseDate]);

  return (
    <React.Fragment>
      <section>
        <form onSubmit={handleAddMovie} className="movie-form">
          <div className="form-control">
            <label htmlFor="title"  style={{ display:'flex', justifyContnent: 'center', marginBottom: '1rem' }}>Title</label>
            <input
              type="text"
              id="title"
              value={newMovieTitle}
              onChange={handleNewMovieTitle}
              style={{ display:'flex', justifyContnent: 'center', marginBottom: '1rem' }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="openingText"  style={{ display:'flex', justifyContnent: 'center', marginBottom: '1rem' }}>Opening Text</label>
            <textarea
              id="openingText"
              row="3"
              value={newMovieOpeningText}
              onChange={handleNewMovieOpeningText}
              style={{ display:'flex', justifyContnent: 'center', marginBottom: '1rem' }}
            ></textarea>
          </div>
          <div className="form-control">
            <label htmlFor="releaseDate"  style={{ display:'flex', justifyContnent: 'center', marginBottom: '1rem' }}>Release Date</label>
            <input
              type="date"
              id="releaseDate"
              value={newMovieReleaseDate}
              onChange={handleNewMovieReleaseDate}
              style={{ display:'flex', justifyContnent: 'center', marginBottom: '1rem' }}
            />
          </div>
          <button type="submit"  style={{ display:'flex', justifyContnent: 'center', marginBottom: '1rem' }}>Add Movie</button>
        </form>

        {isLoading && <p>Loading...</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && (
          <p>Found No Movies....</p>
        )}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && (
          <button onClick={handleCancelRetry}>Cancel Retry</button>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
