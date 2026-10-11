import { useEffect } from "react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const FALLBACK_IMAGE = "/no-movie.png";

const getImageUrl = (path, size = "w500") =>
  path ? `${IMAGE_BASE_URL}${size}${path}` : FALLBACK_IMAGE;

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || amount <= 0) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",

    currency: "USD",

    maximumFractionDigits: 0,
  }).format(amount);
};

const formatRuntime = (runtime) => {
  if (typeof runtime !== "number" || runtime <= 0) {
    return "Not available";
  }

  const hours = Math.floor(runtime / 60);

  const minutes = runtime % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",

    month: "long",

    day: "numeric",
  }).format(parsedDate);
};

const MovieDetails = ({
  movie,

  onClose,

  isInWishlist,

  onToggleWishlist,

  isLoading = false,

  errorMessage = "",
}) => {
  const {
    id,

    title,

    original_title,

    overview,

    tagline,

    poster_path,

    backdrop_path,

    release_date,

    vote_average,

    vote_count,

    popularity,

    genres = [],

    runtime,

    status,

    original_language,

    budget,

    revenue,

    homepage,

    production_companies = [],

    production_countries = [],

    spoken_languages = [],

    credits,

    videos,

    images,

    adult,
  } = movie;

  const cast = credits?.cast || [];

  const crew = credits?.crew || [];

  const allVideos = videos?.results || [];

  const backdrops = images?.backdrops || [];

  const posters = images?.posters || [];

  const directors = crew.filter((person) => person.job === "Director");

  const writers = crew.filter((person) =>
    ["Writer", "Screenplay", "Story"].includes(person.job),
  );

  const trailer =
    allVideos.find(
      (video) =>
        video.site === "YouTube" && video.type === "Trailer" && video.official,
    ) ||
    allVideos.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    ) ||
    allVideos.find((video) => video.site === "YouTube");

  const otherVideos = allVideos.filter(
    (video) => video.site === "YouTube" && video.key !== trailer?.key,
  );

  const rating =
    typeof vote_average === "number" ? vote_average.toFixed(1) : "N/A";

  // Close the modal using the Escape key.

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <section
        className="relative my-3 w-full max-w-6xl overflow-hidden rounded-2xl border border-[#ded2c4]/15 bg-[#1d1f28] text-[#f4f0e9] shadow-2xl shadow-black/50 sm:my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-30 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-3xl leading-none text-white transition hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ded2c4]"
          onClick={onClose}
          aria-label="Close movie details"
        >
          &times;
        </button>

        {/* Backdrop */}

        <div className="relative h-48 overflow-hidden bg-[#293239] sm:h-64 md:h-80">
          {backdrop_path ? (
            <img
              src={getImageUrl(backdrop_path, "original")}
              alt={`${title || "Movie"} backdrop`}
              onError={(event) => {
                event.currentTarget.onerror = null;

                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#293239] via-[#252b34] to-[#151820]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1f28] via-[#1d1f28]/55 to-black/10" />
        </div>

        <div className="relative -mt-16 space-y-8 px-4 pb-6 sm:-mt-24 sm:px-7 sm:pb-9 lg:px-10">
          {/* Main movie information */}

          <div className="flex flex-col items-start gap-5 sm:flex-row sm:gap-7">
            <img
              className="w-32 shrink-0 rounded-xl border border-white/10 object-cover shadow-xl sm:w-44 md:w-52"
              src={getImageUrl(poster_path, "w500")}
              alt={`${title || "Movie"} poster`}
              onError={(event) => {
                event.currentTarget.onerror = null;

                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />

            <div className="min-w-0 flex-1 pt-2 sm:pt-20">
              {adult && (
                <span className="mb-3 inline-flex rounded-full border border-red-300/30 bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-200">
                  Adult
                </span>
              )}

              <h2
                id="movie-details-title"
                className="text-2xl font-black leading-tight sm:text-4xl"
              >
                {title || "Untitled movie"}
              </h2>

              {original_title && original_title !== title && (
                <p className="mt-2 text-sm text-[#b1b5b9]">
                  Original title: {original_title}
                </p>
              )}

              {tagline && (
                <p className="mt-3 text-base italic text-[#ded2c4] sm:text-lg">
                  &ldquo;{tagline}&rdquo;
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#b1b5b9]">
                <span className="font-bold text-[#ded2c4]">★ {rating}/10</span>

                <span>
                  {release_date ? release_date.slice(0, 4) : "Year unavailable"}
                </span>

                <span>{formatRuntime(runtime)}</span>

                {typeof vote_count === "number" && vote_count > 0 && (
                  <span>{vote_count.toLocaleString()} votes</span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    className="rounded-full border border-[#ded2c4]/15 bg-[#252b34] px-3 py-1 text-xs text-[#ded2c4]"
                    key={genre.id}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className={`wishlist-button ${isInWishlist ? "saved" : ""}`}
                aria-pressed={isInWishlist}
                onClick={() => onToggleWishlist(movie)}
              >
                {isInWishlist
                  ? "♥ Remove from Watchlist"
                  : "+ Add to Watchlist"}
              </button>

              {homepage && (
                <a
                  className="mt-4 inline-flex rounded-lg border border-[#ded2c4]/25 px-4 py-2 text-sm font-semibold text-[#ded2c4] transition hover:bg-[#ded2c4]/10"
                  href={homepage}
                  target="_blank"
                  rel="noreferrer"
                >
                  Official Movie Website ↗
                </a>
              )}
            </div>
          </div>

          {/* Request feedback */}

          {isLoading && (
            <p
              className="rounded-xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-100"
              role="status"
            >
              Loading complete movie details...
            </p>
          )}

          {errorMessage && (
            <p
              className="rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          {/* Overview */}

          <section className="border-t border-[#ded2c4]/10 pt-6">
            <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
              Overview
            </h3>

            <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-7 text-[#c5c7c9] sm:text-base">
              {overview || "No overview is available for this movie."}
            </p>
          </section>

          {/* Movie facts */}

          <section className="border-t border-[#ded2c4]/10 pt-6">
            <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
              Movie Information
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Release Date</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {formatDate(release_date)}
                </strong>
              </div>

              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Runtime</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {formatRuntime(runtime)}
                </strong>
              </div>

              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Status</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {status || "Not available"}
                </strong>
              </div>

              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Original Language</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {original_language
                    ? original_language.toUpperCase()
                    : "Not available"}
                </strong>
              </div>

              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Popularity</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {typeof popularity === "number"
                    ? popularity.toFixed(1)
                    : "Not available"}
                </strong>
              </div>

              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Budget</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {formatCurrency(budget)}
                </strong>
              </div>

              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Box Office Revenue</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {formatCurrency(revenue)}
                </strong>
              </div>

              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Production Countries</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {production_countries.length
                    ? production_countries

                        .map((country) => country.name)

                        .join(", ")
                    : "Not available"}
                </strong>
              </div>

              <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4">
                <span>Spoken Languages</span>

                <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                  {spoken_languages.length
                    ? spoken_languages

                        .map((language) => language.english_name)

                        .join(", ")
                    : "Not available"}
                </strong>
              </div>
            </div>
          </section>

          {/* Directors */}

          <section className="border-t border-[#ded2c4]/10 pt-6">
            <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
              Director
            </h3>

            {directors.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {directors.map((person) => (
                  <div
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-3"
                    key={person.credit_id || person.id}
                  >
                    <img
                      src={getImageUrl(person.profile_path, "w185")}
                      className="size-14 shrink-0 rounded-lg object-cover bg-[#293239]"
                      alt={person.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;

                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div>
                      <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                        {person.name}
                      </strong>

                      <span className="text-xs text-[#b1b5b9]">Director</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#b1b5b9]">
                Director information is unavailable.
              </p>
            )}
          </section>

          {/* Writers */}

          <section className="border-t border-[#ded2c4]/10 pt-6">
            <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
              Writers
            </h3>

            {writers.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {writers.map((person) => (
                  <div
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-3"
                    key={`${person.credit_id}-${person.job}`}
                  >
                    <img
                      src={getImageUrl(person.profile_path, "w185")}
                      className="size-14 shrink-0 rounded-lg object-cover bg-[#293239]"
                      alt={person.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;

                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div>
                      <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                        {person.name}
                      </strong>

                      <span>{person.job}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#b1b5b9]">
                Writer information is unavailable.
              </p>
            )}
          </section>

          {/* Cast */}

          <section className="border-t border-[#ded2c4]/10 pt-6">
            <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
              Top Cast
            </h3>

            {cast.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {cast.slice(0, 12).map((person) => (
                  <article
                    className="overflow-hidden rounded-xl border border-[#ded2c4]/10 bg-[#252b34]"
                    key={person.cast_id || person.credit_id || person.id}
                  >
                    <img
                      src={getImageUrl(person.profile_path, "w185")}
                      className="size-14 shrink-0 rounded-lg object-cover bg-[#293239]"
                      alt={person.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;

                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div className="flex flex-col gap-1 p-3">
                      <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                        {person.name}
                      </strong>

                      <span>{person.character || "Role unavailable"}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#b1b5b9]">
                Cast information is unavailable.
              </p>
            )}
          </section>

          {/* Production companies */}

          <section className="border-t border-[#ded2c4]/10 pt-6">
            <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
              Production Companies
            </h3>

            {production_companies.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {production_companies.map((company) => (
                  <div
                    className="flex min-h-20 items-center gap-3 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] px-4 py-3"
                    key={company.id}
                  >
                    {company.logo_path && (
                      <img
                        src={getImageUrl(company.logo_path, "w185")}
                        alt={`${company.name} logo`}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;

                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}

                    <span>{company.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#b1b5b9]">
                Production company information is unavailable.
              </p>
            )}
          </section>

          {/* Main trailer */}

          <section className="border-t border-[#ded2c4]/10 pt-6">
            <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
              Trailer & Videos
            </h3>

            {trailer ? (
              <div className="mt-4 space-y-3">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                  title={`${title} trailer`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />

                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch trailer on YouTube ↗
                </a>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#b1b5b9]">
                No trailer is available for this movie.
              </p>
            )}
          </section>

          {/* Other videos */}

          {otherVideos.length > 0 && (
            <section className="border-t border-[#ded2c4]/10 pt-6">
              <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
                More Videos
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {otherVideos.slice(0, 8).map((video) => (
                  <a
                    className="flex items-center gap-3 rounded-xl border border-[#ded2c4]/10 bg-[#252b34] p-4 transition hover:border-[#ded2c4]/30 hover:bg-[#2d353f]"
                    href={`https://www.youtube.com/watch?v=${video.key}`}
                    target="_blank"
                    rel="noreferrer"
                    key={video.id}
                  >
                    <span>▶</span>

                    <div>
                      <strong className="break-words text-sm font-semibold text-[#f4f0e9]">
                        {video.name}
                      </strong>

                      <span>{video.type}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Backdrop gallery */}

          {backdrops.length > 0 && (
            <section className="border-t border-[#ded2c4]/10 pt-6">
              <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
                Movie Images
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {backdrops.slice(0, 12).map((image) => (
                  <a
                    href={getImageUrl(image.file_path, "original")}
                    target="_blank"
                    rel="noreferrer"
                    key={image.file_path}
                    aria-label={`Open image from ${title}`}
                  >
                    <img
                      src={getImageUrl(image.file_path, "w780")}
                      className="aspect-video w-full rounded-xl border border-[#ded2c4]/10 object-cover"
                      alt={`${title} movie scene`}
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Poster gallery */}

          {posters.length > 0 && (
            <section className="border-t border-[#ded2c4]/10 pt-6">
              <h3 className="text-lg font-bold text-[#f4f0e9] sm:text-xl">
                Posters & Artwork
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {posters.slice(0, 8).map((image) => (
                  <a
                    href={getImageUrl(image.file_path, "original")}
                    target="_blank"
                    rel="noreferrer"
                    key={image.file_path}
                    aria-label={`Open poster for ${title}`}
                  >
                    <img
                      src={getImageUrl(image.file_path, "w342")}
                      className="w-full rounded-xl border border-[#ded2c4]/10 object-cover"
                      alt={`${title} alternative poster`}
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          <p className="mt-3 text-sm text-[#b1b5b9]">
            Movie data and images provided by TMDB.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
