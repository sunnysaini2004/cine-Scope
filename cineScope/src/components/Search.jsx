
const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-2xl border border-[#ded2c4]/15 bg-[#252b34] px-4 py-3 shadow-lg shadow-black/10 transition duration-200 focus-within:border-[#ded2c4]/50 focus-within:ring-2 focus-within:ring-[#ded2c4]/10 sm:px-5">
        <img
          src="/search.svg"
          alt=""
          aria-hidden="true"
          className="size-5 shrink-0 opacity-70"
        />

        <input
          type="text"
          placeholder="Search hundreds of movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search movies"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#f4f0e9] outline-none placeholder:text-[#b1b5b9]/70 sm:text-base"
        />
      </div>
    </div>
  );
};

export default Search;
