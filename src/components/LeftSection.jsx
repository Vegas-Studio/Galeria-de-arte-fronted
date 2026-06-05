export function Leftsection() {
  return (
    <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-container">
      <img alt="Modern Virtual Art" className="absolute inset-0 w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8E7A1lL8wakPPG9nppeU2TlzP2qWEcGtadv1qSjDpGCWoqblWOUB6r6O3bReo_LbpNfQ4942_PWDAhS58QfU5XZt2akyhSNGZ2ZWi8lG6GIrODmCDEnJky21_aooBXi3R4oR_EjoF_wMm_LnS3hmVwoY69sbe61Re2DQdiQkKKMasbAfrbYooqfsa_ADCqreqih_D4fyh2qa-iLPBMLgsx3wR1-aJKH5lmID3m6pb42uXnC3H_ycgWZRbSbOCdywLkK3vAkXyrDk" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="relative z-10 mt-auto p-margin-desktop mb-margin-desktop text-white">
        <h1 className="font-display-lg text-display-lg mb-unit">Obsidian Gallery</h1>
        <p className="font-headline-sm text-headline-sm opacity-90 max-w-md">Excellence in Digital Exhibition Management.</p>
        <div className="mt-gutter flex items-center gap-unit">
          <span className="w-12 h-[1px] bg-white opacity-50"></span>
          <span className="font-label-md text-label-md uppercase tracking-widest opacity-70">Curated Intelligence</span>
        </div>
      </div>
    </section>
  );
}