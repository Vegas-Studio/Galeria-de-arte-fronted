import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const ArtistGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdminView = location.pathname.startsWith("/admin");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/artists`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Error en la respuesta del servidor al cargar artistas");
        const data = await response.json();
        setArtists(data);
        console.log("Artistas recibidos del backend:", data); // Agrega esta línea
      } catch (error) {
        console.error("Error al cargar artistas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handleDeleteArtist = async (artistId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este artista?")) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/artists/${artistId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert("Artista eliminado exitosamente");
        setArtists(artists.filter(artist => artist.id !== artistId));
      } else {
        const err = await response.json();
        alert(err.error || "Error al eliminar artista");
      }
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  if (loading) return <div className="text-center py-20 font-label-md">Cargando Artistas...</div>;

  return (
    <section className="max-w-container-max mx-auto px-margin-desktop py-16">
      {isAdminView && (
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => navigate("/admin/artists/new")}
            className="bg-primary text-white py-2 px-4 font-label-md uppercase tracking-widest hover:bg-black transition-all"
          >
            Agregar Nuevo Artista
          </button>
        </div>
      )}

      {artists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-surface-container-high border border-outline-variant p-6 shadow-sm"
            >
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{artist.full_name}</h3>
              <p className="font-body-md text-on-surface-variant">{artist.nationality}</p>
              <p className="font-body-sm text-on-surface-variant italic">
                {artist.birth_date} {artist.death_date ? `- ${artist.death_date}` : ''}
              </p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigate(`${isAdminView ? '/admin' : ''}/artists/${artist.id}`)} className="text-primary hover:underline font-label-md">Ver Detalles</button>
                {isAdminView && (
                  <>
                    <button onClick={() => navigate(`/admin/artists/${artist.id}/edit`)} className="text-secondary hover:underline font-label-md">Editar</button>
                    <button onClick={() => handleDeleteArtist(artist.id)} className="text-error hover:underline font-label-md">Eliminar</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant">
          <p className="font-body-lg text-on-surface-variant italic">No hay artistas registrados.</p>
        </div>
      )}
    </section>
  );
};