import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-8 gap-6 max-w-container-max mx-auto">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="font-display-lg text-headline-sm tracking-widest text-primary uppercase mb-2">
            OBSIDIAN GALLERY
          </div>
          <p className="font-body-sm text-on-surface-variant max-w-xs text-center md:text-left">
            A virtual space dedicated to the intersection of traditional medium
            and the obsidian digital horizon.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="font-label-md text-label-md uppercase text-primary">
            Discovery
          </span>
          <Link
            className="font-label-md text-label-sm text-on-surface-variant hover:text-secondary transition-colors"
            to="/about"
          >
            About Us
          </Link>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-desktop py-4 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">
          © 2026 OBSIDIAN GALLERY. ESTABLISHED FOR THE PRESERVATION OF VIRTUAL
          EXCELLENCE.
        </p>
      </div>
    </footer>
  );
};
