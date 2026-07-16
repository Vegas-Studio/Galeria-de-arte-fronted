import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ArtworkGrid = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const createdUrls = [];

    const fetchArtworks = async () => {
      try {
        const token = localStorage.getItem('token');
        // Asumiendo que este endpoint devuelve solo obras aprobadas
        const response = await fetch(`${API_URL}/artworks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Error en la respuesta del servidor");
        const data = await response.json();
        
        console.log("DEBUG: Datos recibidos en Galería:", data);

        // Manejamos si el backend devuelve un arreglo directo o un objeto con una propiedad
        const rawArtworks = Array.isArray(data) ? data : (data.artworks || data.data || []);
        
        const processed = rawArtworks
          .filter(art => art.status?.toString().trim().toLowerCase() === "aprobado")
          .map(art => {
            let displayUrl = 'https://placehold.co/600x800?text=Imagen+No+Encontrada';
            
            if (art.original_image) {
              if (typeof art.original_image === 'string' && art.original_image.startsWith('http')) {
                displayUrl = art.original_image;
              } else if (typeof art.original_image === 'string' && !art.original_image.startsWith('http')) {
                displayUrl = `data:image/jpeg;base64,${art.original_image}`;
              } else if (art.original_image && (art.original_image.data || Array.isArray(art.original_image))) {
                const binaryData = art.original_image.data ? art.original_image.data : art.original_image;
                const blob = new Blob([new Uint8Array(binaryData)], { type: 'image/jpeg' });
                displayUrl = URL.createObjectURL(blob);
                createdUrls.push(displayUrl);
              }
            }
            return { ...art, displayUrl };
          });

        setArtworks(processed);
      } catch (error) {
        console.error("Error al cargar la galería:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();

    return () => {
      createdUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  if (loading) return <div className="text-center py-20 font-label-md">Cargando Galería...</div>;

  return (
    <section className="max-w-container-max mx-auto px-margin-desktop py-16">
      {artworks.length > 0 ? (
        <div className="masonry-grid gap-10">
          {artworks.map((artwork) => (
            <div 
              key={artwork.id} 
              onClick={() => navigate(`/artwork/${artwork.id}`)} 
              className="masonry-item artwork-card group cursor-pointer"
            >
              <div className="relative overflow-hidden mb-6 border border-outline-variant">
                <img
                  alt={artwork.title}
                  className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                  src={artwork.displayUrl}
                />
                <div className="artwork-action absolute inset-0 bg-primary/20 opacity-0 transition-all duration-500 flex items-center justify-center translate-y-4">
                  <span className="bg-white text-primary px-6 py-3 font-label-md text-label-md uppercase tracking-widest">
                    View Artwork
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{artwork.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">{artwork.artist?.full_name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant">
          <p className="font-body-lg text-on-surface-variant italic">No hay curadurías disponibles en este momento.</p>
        </div>
      )}
      
      <div className="flex justify-center mt-20">
        <button className="font-label-md text-label-md uppercase tracking-[0.2em] border-b border-on-surface pb-2 hover:opacity-50 transition-opacity">
          Load More Artworks
        </button>
      </div>
    </section>
  );
};
