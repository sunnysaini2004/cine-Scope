
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "/no-movie.png";

const MovieCard = ({
  movie,
  isInWishlist,
  onToggleWishlist,
  onSelectMovie,
}) => {
  const {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
    original_language,
    genres,
  } = movie;

  const posterUrl = poster_path
    ? `${IMAGE_BASE_URL}${poster_path}`
    : FALLBACK_IMAGE;

  const releaseYear = release_date
    ? release_date.slice(0, 4)
    : "Year unavailable";

  const rating =
    typeof vote_average === "number"
      ? vote_average.toFixed(1)
      : "N/A";

  const language = original_language
    ? original_language.toUpperCase()
    : "N/A";

  const genreNames = Array.isArray(genres)
    ? genres.map((genre) => genre.name).filter(Boolean)
    : [];

  const handleOpenDetails = () => {
    if (typeof onSelectMovie === "function") {
      onSelectMovie(movie);
    }
  };

  const handleWishlistClick = (event) => {
    event.stopPropagation();
    onToggleWishlist(movie);
  };

  return (
    <li
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#ded2c4]/10 bg-[#252b34] p-3 text-[#f4f0e9] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#ded2c4]/35 hover:shadow-2xl hover:shadow-black/25 sm:p-4"
    >
      <button
        type="button"
        onClick={handleOpenDetails}
        aria-label={`View details for ${title || "this movie"}`}
        className="block w-full shrink-0 overflow-hidden rounded-xl bg-[#293239] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ded2c4]"
      >
        <img
          src={posterUrl}
          alt={`${title || "Movie"} poster`}
          loading="lazy"
          className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </button>

      <div className="flex flex-1 flex-col gap-3 pt-4">
        <button
          type="button"
          onClick={handleOpenDetails}
          aria-label={`View details for ${title || "this movie"}`}
          className="line-clamp-2 min-h-10 text-left text-sm font-bold leading-6 text-[#f4f0e9] transition hover:text-[#ded2c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ded2c4] sm:text-base"
        >
          {title || "Untitled movie"}
        </button>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#b1b5b9] sm:text-sm">
          <span
            className="font-bold text-[#ded2c4]"
            aria-label={`Rating ${rating} out of 10`}
          >
            ★ {rating}
          </span>

          <span>{releaseYear}</span>
          <span>{language}</span>
        </div>

        {genreNames.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {genreNames.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-[#ded2c4]/15 bg-[#1d1f28]/60 px-2.5 py-1 text-xs text-[#ded2c4]"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleWishlistClick}
          aria-pressed={isInWishlist}
          className={`mt-auto min-h-10 w-full rounded-xl border px-2 py-2.5 text-xs font-bold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ded2c4] sm:text-sm ${
            isInWishlist
              ? "border-[#ded2c4]/25 bg-[#ded2c4]/10 text-[#ded2c4] hover:bg-[#ded2c4]/20"
              : "border-[#ded2c4] bg-[#ded2c4] text-[#1d1f28] hover:bg-[#c6b7a6]"
          }`}
        >
          {isInWishlist ? "♥ In Watchlist" : "+ Add to Watchlist"}
        </button>
      </div>
    </li>
  );
};

export default MovieCard;
