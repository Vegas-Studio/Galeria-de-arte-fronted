import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-margin-desktop py-12 gap-gutter max-w-container-max mx-auto">
        <div className="flex flex-col mb-8 md:mb-0">
          <div className="font-display-lg text-headline-sm tracking-widest text-primary uppercase mb-4">
            OBSIDIAN GALLERY
          </div>
          <p className="font-body-sm text-on-surface-variant max-w-xs">
            A virtual space dedicated to the intersection of traditional medium
            and the obsidian digital horizon.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-3">
            <span className="font-label-md text-label-md uppercase text-primary mb-2">
              Institutional
            </span>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Institutional Press
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-label-md text-label-md uppercase text-primary mb-2">
              Discovery
            </span>
            <Link
              className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
              to="/about"
            >
              About Us
            </Link>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Contact
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Artists
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-desktop py-6 border-t border-outline-variant/30 flex justify-between items-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          © 2024 OBSIDIAN GALLERY. ESTABLISHED FOR THE PRESERVATION OF VIRTUAL
          EXCELLENCE.
        </p>
        <div className="flex gap-4">
          <button className="scale-100 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
          <button className="scale-100 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[18px]">mail</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
