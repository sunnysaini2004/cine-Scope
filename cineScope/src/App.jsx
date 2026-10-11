import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "react-use";

import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const STORAGE_KEY = "cinescope-wishlist";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState("discover");
  const [sortBy, setSortBy] = useState("popularity");

  // Identify the latest movie-details request.
  const detailsRequestId = useRef(0);

  // Load saved movies from localStorage.
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem(STORAGE_KEY);
      const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
      return Array.isArray(parsedWishlist) ? parsedWishlist : [];
    } catch {
      return [];
    }
  });

  // Persist wishlist changes across browser refreshes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Could not save wishlist:", error);
    }
  }, [wishlist]);

  // Debounce search input to reduce unnecessary API requests.
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm.trim());
    },
    500,
    [searchTerm],
  );

  // Add a movie to the wishlist or remove it if already saved.
  const toggleWishlist = useCallback((movie) => {
    setWishlist((currentWishlist) => {
      const alreadySaved = currentWishlist.some(
        (savedMovie) => savedMovie.id === movie.id,
      );

      if (alreadySaved) {
        return currentWishlist.filter(
          (savedMovie) => savedMovie.id !== movie.id,
        );
      }

      return [...currentWishlist, movie];
    });
  }, []);

  // Fetch complete movie details, cast, crew, videos, and images.
  const fetchMovieDetails = useCallback(async (movie) => {
    // Every new request invalidates the previous request.
    const requestId = ++detailsRequestId.current;

    setSelectedMovie(movie);
    setDetailsLoading(true);
    setDetailsError("");

    if (!API_KEY) {
      if (requestId === detailsRequestId.current) {
        setDetailsError(
          "TMDB API token is missing. Check your .env.local file.",
        );
        setDetailsLoading(false);
      }
      return;
    }

    try {
      const endpoint =
        `${API_BASE_URL}/movie/${movie.id}` +
        "?append_to_response=credits,videos,images";

      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.status_message ||
            `Could not load movie details (${response.status}).`,
        );
      }

      // Update details only if this is still the latest request.
      if (requestId === detailsRequestId.current) {
        setSelectedMovie((currentMovie) =>
          currentMovie?.id === movie.id
            ? { ...currentMovie, ...data }
            : currentMovie,
        );
      }
    } catch (error) {
      // Ignore errors from requests that are no longer current.
      if (requestId === detailsRequestId.current) {
        console.error("Error fetching movie details:", error);
        setDetailsError(error.message || "Could not load movie details.");
      }
    } finally {
      // An older request must not stop the latest request's loader.
      if (requestId === detailsRequestId.current) {
        setDetailsLoading(false);
      }
    }
  }, []);

  // Close the movie details modal and invalidate pending requests.
  const closeMovieDetails = useCallback(() => {
    detailsRequestId.current += 1;
    setSelectedMovie(null);
    setDetailsLoading(false);
    setDetailsError("");
  }, []);

  // Fetch popular movies or search TMDB.
  const fetchMovies = useCallback(async (query, signal) => {
    if (!API_KEY) {
      setMovieList([]);
      setErrorMessage(
        "TMDB API token is missing. Check your .env.local file.",
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, {
        ...API_OPTIONS,
        signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.status_message || `TMDB request failed (${response.status}).`,
        );
      }

      const results = Array.isArray(data.results) ? data.results : [];
      setMovieList(results);

      if (results.length === 0) {
        setErrorMessage(
          query
            ? "No movies found. Try another search."
            : "No popular movies found.",
        );
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error("Error fetching movies:", error);
      setMovieList([]);
      setErrorMessage(
        error.message || "Failed to fetch movies. Please try again.",
      );
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // Fetch movies only while Discover is active.
  useEffect(() => {
    if (activeView !== "discover") {
      setIsLoading(false);
      setErrorMessage("");
      return undefined;
    }

    const controller = new AbortController();
    fetchMovies(debouncedSearchTerm, controller.signal);

    return () => {
      controller.abort();
    };
  }, [activeView, debouncedSearchTerm, fetchMovies]);

  // Filter and sort the movies shown in the current view.
  const visibleMovies = useMemo(() => {
    const sourceMovies = activeView === "wishlist" ? wishlist : movieList;

    const filteredMovies =
      debouncedSearchTerm && activeView === "wishlist"
        ? sourceMovies.filter((movie) =>
            (movie.title || "")
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()),
          )
        : sourceMovies;

    return [...filteredMovies].sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "rating") {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }

      if (sortBy === "releaseDate") {
        return (b.release_date || "").localeCompare(a.release_date || "");
      }

      return (b.popularity || 0) - (a.popularity || 0);
    });
  }, [activeView, wishlist, movieList, debouncedSearchTerm, sortBy]);

  // Switch to Discover and reset the search.
  const showDiscover = () => {
    setActiveView("discover");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSortBy("popularity");
  };

  // Switch to the saved Watchlist.
  const showWishlist = () => {
    setActiveView("wishlist");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSortBy("title");
  };

  const sectionButtonClasses =
    "inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DED2C4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D1F28]";

  const scrollToMovies = () => {
    document.getElementById("movies-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#1D1F28] text-[#F3F0EA]">
      {/* Soft cinematic lighting; the movie poster itself is not a page background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(81,90,98,0.34),transparent_55%),linear-gradient(180deg,#222831_0%,#1D1F28_45%,#17191F_100%)]"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pt-9">
        {/* Hero section: image first, then the text content beneath it. */}
        <header className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          {/* Dedicated Spider-Man image banner */}
          <div className="flex h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#DED2C4]/15 bg-[#252B34] shadow-[0_22px_60px_rgba(0,0,0,0.3)] sm:h-[320px] sm:rounded-3xl lg:h-[440px]">
            <img
              src="/hero.jpg"
              alt="Spider-Man cinematic scene"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Badge */}
          <p className="mt-6 mb-4 inline-flex items-center gap-2 rounded-full border border-[#DED2C4]/15 bg-[#293239]/65 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#DED2C4] sm:mt-7 sm:mb-5 sm:text-xs">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[#DED2C4]"
            />
            Discover · Stories · Emotions
          </p>

          {/* Main heading */}
          <h1 className="max-w-5xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[#F3F0EA] sm:text-5xl md:text-6xl lg:text-7xl">
            Discover{" "}
            <span className="bg-gradient-to-r from-[#DED2C4] via-[#F4E8D8] to-[#9BA8B0] bg-clip-text text-transparent">
              Movies
            </span>{" "}
            You Love
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#C0C5C9] sm:mt-5 sm:text-base md:text-lg md:leading-7">
            Find your next favorite story, explore unforgettable films, and
            keep your watchlist in one place.
          </p>

          {/* Hero CTA */}
          <button
            type="button"
            onClick={scrollToMovies}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#DED2C4] px-6 py-3 text-sm font-bold text-[#1D1F28] shadow-lg shadow-black/10 transition duration-200 hover:bg-[#F3F0EA] hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DED2C4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D1F28] sm:mt-7"
          >
            Explore Movies <span aria-hidden="true">→</span>
          </button>

          {/* Existing search component */}
          <div className="mt-7 w-full max-w-3xl sm:mt-8">
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </header>

        {/* Existing Discover and Watchlist navigation */}
        <nav
          aria-label="Movie sections"
          className="mx-auto my-7 flex w-full max-w-6xl flex-wrap items-center justify-center gap-3 sm:my-9 sm:justify-start"
        >
          <button
            type="button"
            onClick={showDiscover}
            aria-pressed={activeView === "discover"}
            className={`${sectionButtonClasses} ${
              activeView === "discover"
                ? "border-[#DED2C4] bg-[#DED2C4] text-[#1D1F28] shadow-[0_8px_24px_rgba(222,210,196,0.12)] hover:bg-[#F0E6DA]"
                : "border-[#515A62] bg-[#293239]/55 text-[#E8E5DF] hover:border-[#DED2C4]/50 hover:bg-[#293239]"
            }`}
          >
            Discover Movies
          </button>

          <button
            type="button"
            onClick={showWishlist}
            aria-pressed={activeView === "wishlist"}
            className={`${sectionButtonClasses} ${
              activeView === "wishlist"
                ? "border-[#DED2C4] bg-[#DED2C4] text-[#1D1F28] shadow-[0_8px_24px_rgba(222,210,196,0.12)] hover:bg-[#F0E6DA]"
                : "border-[#515A62] bg-[#293239]/55 text-[#E8E5DF] hover:border-[#DED2C4]/50 hover:bg-[#293239]"
            }`}
          >
            My Watchlist
            <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">
              {wishlist.length}
            </span>
          </button>
        </nav>

        {/* Movie collection: the Explore Movies button scrolls here. */}
        <section
          id="movies-section"
          className="mx-auto w-full max-w-6xl scroll-mt-6"
          aria-labelledby="movie-section-title"
        >
          <div className="mb-5 flex flex-col gap-4 border-b border-[#515A62]/45 pb-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#9BA8B0]">
                Your next movie night
              </p>
              <h2
                id="movie-section-title"
                className="text-2xl font-bold tracking-tight text-[#F3F0EA] sm:text-3xl"
              >
                {activeView === "wishlist"
                  ? "My Watchlist"
                  : debouncedSearchTerm
                    ? "Search Results"
                    : "Popular Movies"}
              </h2>
            </div>

            <label className="flex items-center gap-3 text-sm text-[#C0C5C9]">
              <span className="shrink-0">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="min-h-11 min-w-36 rounded-xl border border-[#515A62] bg-[#293239] px-3 py-2 text-sm font-medium text-[#F3F0EA] outline-none transition focus:border-[#DED2C4] focus:ring-2 focus:ring-[#DED2C4]/20"
              >
                <option value="popularity">Popularity</option>
                <option value="title">Title</option>
                <option value="rating">Rating</option>
                <option value="releaseDate">Release date</option>
              </select>
            </label>
          </div>

          {activeView === "discover" && isLoading ? (
            <div className="flex min-h-56 items-center justify-center">
              <Spinner />
            </div>
          ) : activeView === "discover" && errorMessage ? (
            <p
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-[#515A62]/70 bg-[#293239]/60 px-5 py-8 text-center text-sm text-[#DED2C4] sm:px-8"
            >
              {errorMessage}
            </p>
          ) : visibleMovies.length === 0 ? (
            <p
              role="status"
              className="rounded-2xl border border-[#515A62]/70 bg-[#293239]/60 px-5 py-8 text-center text-sm leading-6 text-[#C0C5C9] sm:px-8"
            >
              {activeView === "wishlist"
                ? debouncedSearchTerm
                  ? "No saved movies match your search."
                  : "Your watchlist is empty. Discover movies and save the ones you want to watch later."
                : "No movies to display."}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 xl:grid-cols-5">
              {visibleMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWishlist={wishlist.some(
                    (savedMovie) => savedMovie.id === movie.id,
                  )}
                  onToggleWishlist={toggleWishlist}
                  onSelectMovie={fetchMovieDetails}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Movie details modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={closeMovieDetails}
          isInWishlist={wishlist.some(
            (savedMovie) => savedMovie.id === selectedMovie.id,
          )}
          onToggleWishlist={toggleWishlist}
          isLoading={detailsLoading}
          errorMessage={detailsError}
        />
      )}
    </main>
  );
};

export default App;
