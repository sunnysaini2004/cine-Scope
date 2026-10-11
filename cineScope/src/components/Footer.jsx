const Footer = () => {
  return (
    <footer className="mt-16 border-t border-[#ded2c4]/15 bg-[#151820] px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center">
        <h2 className="font-bebas-neue text-2xl tracking-wider text-[#f4f0e9]">
          CineScope
        </h2>

        <p className="text-sm text-[#b1b5b9]">
          Discover movies. Find your next favorite.
        </p>

        <div className="my-2 h-px w-full max-w-md bg-[#ded2c4]/15" />

        <p className="text-xs text-[#b1b5b9]">
          © {new Date().getFullYear()} CineScope. All rights reserved.
        </p>

        <p className="text-sm text-[#ded2c4]">
          Developed with ❤️ by{" "}
          <span className="font-semibold text-[#f4f0e9]">
            Sunny Saini
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;