export const Newsletter = () => {
  return (
    <section className="bg-surface-container-low py-32 border-y border-outline-variant">
      <div className="max-w-2xl mx-auto px-margin-mobile text-center">
        <h2 className="font-display-lg text-headline-lg mb-6">
          Receive Curatorial Insights
        </h2>
        <p className="font-body-md text-on-surface-variant mb-12">
          Join our selective mailing list for private viewing invitations,
          artist interviews, and early access to Volume II.
        </p>
        <div className="flex flex-col md:flex-row gap-0 border border-primary">
          <input
            className="flex-grow bg-transparent border-none px-6 py-4 font-label-md focus:ring-0 placeholder:text-outline"
            placeholder="ENTER EMAIL ADDRESS"
            type="email"
          />
          <button className="bg-primary text-white px-10 py-4 font-label-md text-label-md uppercase tracking-widest transition-opacity hover:opacity-90">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};
