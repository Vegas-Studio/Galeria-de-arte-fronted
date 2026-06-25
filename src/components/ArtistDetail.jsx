import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdminView = location.pathname.startsWith("/admin");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchArtistDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/artists/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error("Error cargando detalle del artista:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetail();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-label-md">Cargando detalles del artista...</div>;
  if (!artist) return <div className="p-20 text-center font-label-md">Artista no encontrado</div>;

  return (
    <div className="min-h-screen bg-background p-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary font-label-md uppercase mb-10 hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          {isAdminView ? "Regresar a Gestión de Artistas" : "Regresar a Artistas"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Información del Artista */}
          <div className="lg:col-span-8 space-y-8 bg-surface-container-high border border-outline-variant p-10">
            <div>
              <h1 className="font-display-lg text-display-lg text-primary mt-2">{artist.full_name}</h1>
              <p className="font-headline-sm text-on-surface-variant italic">{artist.nationality}</p>
              <p className="font-body-md text-on-surface-variant">
                Nacimiento: {artist.birth_date} {artist.death_date ? ` - Fallecimiento: ${artist.death_date}` : ''}
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-label-md uppercase text-on-surface-variant">Biografía</p>
              <p className="font-body-lg text-on-surface leading-relaxed">{artist.biography}</p>
            </div>

            {isAdminView && (
              <div className="pt-10 flex gap-4">
                <button
                  onClick={() => navigate(`/admin/artists/${artist.id}/edit`)}
                  className="flex-1 bg-primary text-white py-4 font-label-md uppercase tracking-widest hover:bg-black transition-all"
                >
                  Editar Artista
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}