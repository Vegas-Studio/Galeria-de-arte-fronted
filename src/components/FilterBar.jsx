export const Filterbar = () => {
  return (
    <section className="sticky top-[90px] z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-desktop py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          <button className="font-label-md text-label-md uppercase text-primary border-b border-primary whitespace-nowrap">
            All Works
          </button>
          <button className="font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">
            Digital Canvas
          </button>
          <button className="font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">
            Monoliths
          </button>
          <button className="font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">
            Oil &amp; Texture
          </button>
          <button className="font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">
            Abstract Geometry
          </button>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="font-label-md text-label-md uppercase">
            Sorted by: Newest
          </span>
          <span className="material-symbols-outlined text-[20px]">
            filter_list
          </span>
        </div>
      </div>
    </section>
  );
};
