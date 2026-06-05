import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdminView = location.pathname.startsWith("/admin");

  useEffect(() => {
    let currentUrl = null;

    const fetchArtworkDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://galeria-de-arte-backend.onrender.com/api/artworks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();

        if (!data.original_image) {
          console.warn("AVISO: El backend no envió 'original_image'. Revisa los permisos de tu rol en la API.");
        }

        let displayUrl = 'https://placehold.co/800x600?text=Imagen+No+Disponible';
        if (data.original_image) {
          if (typeof data.original_image === 'string' && data.original_image.startsWith('http')) {
            displayUrl = data.original_image;
          } else if (typeof data.original_image === 'string') {
            // Soporte para Base64
            displayUrl = `data:image/jpeg;base64,${data.original_image}`;
          } else if (data.original_image.data || Array.isArray(data.original_image)) {
            const binaryData = data.original_image.data || data.original_image;
            const blob = new Blob([new Uint8Array(binaryData)], { type: 'image/jpeg' });
            displayUrl = URL.createObjectURL(blob);
            currentUrl = displayUrl;
          }
        }

        setArtwork({ ...data, displayUrl });
      } catch (error) {
        console.error("Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetail();

    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://galeria-de-arte-backend.onrender.com/api/artworks/${id}/status`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert(`Obra ${newStatus} exitosamente`);
        window.location.reload();
      } else {
        const err = await response.json();
        alert(err.error || "Error al actualizar estado");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <div className="p-20 text-center font-label-md">Cargando detalles...</div>;
  if (!artwork) return <div className="p-20 text-center font-label-md">Obra no encontrada</div>;

  return (
    <div className="min-h-screen bg-background p-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary font-label-md uppercase mb-10 hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span> 
          {isAdminView ? "Regresar al Inventario" : "Regresar a la Galería"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Imagen de la obra */}
          <div className="lg:col-span-7 bg-surface-container-high border border-outline-variant p-10 flex items-center justify-center">
            <img src={artwork.displayUrl} alt={artwork.title} className="max-w-full h-auto shadow-2xl" />
          </div>

          {/* Información y Gestión */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              {isAdminView && (
                <span className="text-secondary font-label-md uppercase tracking-widest">{artwork.status}</span>
              )}
              <h1 className="font-display-lg text-display-lg text-primary mt-2">{artwork.title}</h1>
              <p className="font-headline-sm text-on-surface-variant italic">{artwork.artist?.full_name}, {artwork.creation_year}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-outline-variant py-6">
              <div>
                <p className="font-label-md uppercase text-on-surface-variant">Técnica</p>
                <p className="font-body-md">{artwork.technique}</p>
              </div>
              <div>
                <p className="font-label-md uppercase text-on-surface-variant">Dimensiones</p>
                <p className="font-body-md">{artwork.dimensions}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-label-md uppercase text-on-surface-variant">Curatorial Note</p>
              <p className="font-body-lg text-on-surface leading-relaxed">{artwork.description}</p>
            </div>

            {isAdminView && (
              <div className="pt-10 flex gap-4">
                <button 
                  onClick={() => handleStatusUpdate('Aprobado')}
                  className="flex-1 bg-primary text-white py-4 font-label-md uppercase tracking-widest hover:bg-black transition-all"
                >
                  Aprobar Obra
                </button>
                <button 
                  onClick={() => handleStatusUpdate('Rechazado')}
                  className="flex-1 border border-error text-error py-4 font-label-md uppercase tracking-widest hover:bg-error/5 transition-all"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}