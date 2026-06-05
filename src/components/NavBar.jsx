import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-margin-desktop py-6 max-w-container-max mx-auto">
        <Link
          className="font-display-lg text-headline-md tracking-widest text-primary uppercase"
          to="/"
        >
          OBSIDIAN GALLERY
        </Link>
        <div className="hidden md:flex gap-10 items-center">
          <Link
            className="text-on-surface-variant font-label-md text-label-md uppercase hover:text-primary transition-colors duration-200"
            to="/"
          >
            Exhibitions
          </Link>
          <Link
            className="text-on-surface-variant font-label-md text-label-md uppercase hover:text-primary transition-colors duration-200"
            to="/about"
          >
            About
          </Link>
          <a
            className="text-on-surface-variant font-label-md text-label-md uppercase hover:text-primary transition-colors duration-200"
            href="#"
          >
            Archive
          </a>
        </div>
        <div className="flex items-center gap-6">
          <button className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          <Link to="/login" className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
