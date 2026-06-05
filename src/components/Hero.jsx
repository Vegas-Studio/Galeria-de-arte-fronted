export const Hero = () => {
  return (
    <section className="relative w-full h-[870px] overflow-hidden bg-primary-container">
      <img
        alt="Featured Exhibition"
        className="w-full h-full object-cover opacity-80"
        data-alt="A massive, high-contrast black and white digital artwork displayed in a vast, minimalist gallery with white floors and grey walls. The artwork features complex, static-like monochromatic structures. The lighting is focused and dramatic, highlighting the scale of the piece within the high-end virtual space. The atmosphere is quiet, authoritative, and sophisticated."
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhHAlcsRr11YkcUfHud6UbmSzjZ4yMO2mB1pl972iCSVKPMolLnHKOjVasnfEfMDeWkwI61gMUw1npWGT0Pt_OIzIUcbtwkNz8nmvq7Bhrf4jWa-1Mb9_a1tsd5bTLdnvCr1ouCrF0Y3Jmnu-3UVMAx3vI2Vy99YwwRwWWxyWv9DUdH68WhpQlDmOROT5-QIGMNs8JEu6ORXRH3wR68RLu-f5zAMs0J4rLkt2Yd3B4cWAN8rYVGU5DhxKlDGuMu3icK4PmcN3pKGY"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-margin-desktop md:p-20 curatorial-overlay">
        <div className="max-w-4xl">
          <span className="font-label-md text-label-md text-secondary-container uppercase tracking-widest mb-4 block">
            Current Exhibition
          </span>
          <h1 className="font-display-lg text-white text-7xl md:text-8xl leading-none mb-8">
            The Obsidian Collective: Volume I
          </h1>
          <p className="font-body-lg text-white/80 max-w-2xl mb-10">
            An exploration of digital permanence and physical decay. Volume I
            curates a series of dialogues between light-reactive sculptures and
            generative digital landscapes.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-primary px-8 py-4 font-label-md text-label-md uppercase tracking-widest transition-transform active:scale-95">
              Explore Collection
            </button>
            <button className="border border-white/30 text-white px-8 py-4 font-label-md text-label-md uppercase tracking-widest hover:bg-white/10 transition-colors">
              Exhibition Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
