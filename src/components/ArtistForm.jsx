import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ArtistForm() {
  const { id } = useParams(); // 'id' will be present for editing
  const navigate = useNavigate();
  const [artist, setArtist] = useState({
    full_name: "",
    biography: "",
    birth_date: "",
    death_date: "",
    nationality: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!id;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isEditing) {
      const fetchArtist = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/artists/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) throw new Error("Error al cargar los datos del artista.");
          const data = await response.json();
          setArtist(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchArtist();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtist((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${API_URL}/artists/${id}`
      : `${API_URL}/artists`;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artist),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Error al ${isEditing ? 'actualizar' : 'crear'} el artista.`);
      }

      alert(`Artista ${isEditing ? 'actualizado' : 'creado'} exitosamente.`);
      navigate("/admin/artists"); // Redirect to artist list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="p-20 text-center font-label-md">Cargando datos del artista...</div>;

  return (
    <div className="min-h-screen bg-background p-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary font-label-md uppercase mb-10 hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Regresar a Gestión de Artistas
        </button>

        <h1 className="font-display-lg text-display-lg text-primary mb-8">
          {isEditing ? "Editar Artista" : "Crear Nuevo Artista"}
        </h1>

        {error && <div className="bg-error-container text-on-error-container p-4 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-surface-container-high border border-outline-variant p-10 space-y-6">
          <div>
            <label htmlFor="full_name" className="block font-label-md text-on-surface-variant mb-2">Nombre Completo</label>
            <input type="text" id="full_name" name="full_name" value={artist.full_name} onChange={handleChange} required className="w-full p-3 border border-outline rounded-md bg-surface-container text-on-surface" />
          </div>
          <div>
            <label htmlFor="biography" className="block font-label-md text-on-surface-variant mb-2">Biografía</label>
            <textarea id="biography" name="biography" value={artist.biography} onChange={handleChange} rows="5" className="w-full p-3 border border-outline rounded-md bg-surface-container text-on-surface"></textarea>
          </div>
          <div>
            <label htmlFor="birth_date" className="block font-label-md text-on-surface-variant mb-2">Fecha de Nacimiento</label>
            <input type="date" id="birth_date" name="birth_date" value={artist.birth_date} onChange={handleChange} className="w-full p-3 border border-outline rounded-md bg-surface-container text-on-surface" />
          </div>
          <div>
            <label htmlFor="death_date" className="block font-label-md text-on-surface-variant mb-2">Fecha de Fallecimiento (opcional)</label>
            <input type="date" id="death_date" name="death_date" value={artist.death_date} onChange={handleChange} className="w-full p-3 border border-outline rounded-md bg-surface-container text-on-surface" />
          </div>
          <div>
            <label htmlFor="nationality" className="block font-label-md text-on-surface-variant mb-2">Nacionalidad</label>
            <input type="text" id="nationality" name="nationality" value={artist.nationality} onChange={handleChange} className="w-full p-3 border border-outline rounded-md bg-surface-container text-on-surface" />
          </div>
          <button type="submit" disabled={loading} className="bg-primary text-white py-3 px-6 font-label-md uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50">
            {loading ? "Guardando..." : (isEditing ? "Actualizar Artista" : "Crear Artista")}
          </button>
        </form>
      </div>
    </div>
  );
}