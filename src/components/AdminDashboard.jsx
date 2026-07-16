import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ setRole }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({ totalCollection: 0, pendingReview: 0, storageUsed: "0 MB" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/artworks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error("Error al obtener inventario");
      const data = await response.json();
      
      const raw = Array.isArray(data) ? data : [];
      const processed = raw.map(art => {
        let displayUrl = 'https://placehold.co/100?text=Err';
        if (art.original_image) {
          if (typeof art.original_image === 'string' && art.original_image.startsWith('http')) {
            displayUrl = art.original_image;
          } else if (typeof art.original_image === 'string') {
            displayUrl = `data:image/jpeg;base64,${art.original_image}`;
          }
        }
        return { ...art, displayUrl };
      });

      setArtworks(processed);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/artworks/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  const handleUpdateStatus = async (id, status, message) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/artworks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, message })
      });
      if (response.ok) {
        alert(`Obra ${status === 'Aprobado' ? 'aprobada' : 'rechazada'} correctamente.`);
        fetchInventory();
        fetchStats();
      } else {
        const err = await response.json();
        alert(err.error || 'Error al actualizar el estado de la obra');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error de conexión al actualizar el estado.');
    }
  };

  const handleApprove = async (id) => {
    if (confirm("¿Estás seguro de que deseas aprobar esta obra?")) {
      await handleUpdateStatus(id, 'Aprobado');
    }
  };

  const handleRejectPrompt = async (id) => {
    const reason = prompt("Introduce el motivo de rechazo (obligatorio):");
    if (reason === null) return; // cancelado
    if (!reason.trim()) {
      alert("Debes proporcionar un motivo para rechazar la obra.");
      return;
    }
    await handleUpdateStatus(id, 'Rechazado', reason);
  };

  const handleDeleteArtwork = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta obra definitivamente?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/artworks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        alert('Obra eliminada correctamente.');
        setArtworks(prev => prev.filter(art => art.id !== id));
        fetchStats();
      } else {
        const err = await response.json();
        alert(err.error || 'Error al eliminar la obra');
      }
    } catch (error) {
      console.error('Error al eliminar obra:', error);
      alert('Error de conexión al eliminar la obra.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setRole(null);
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 border font-label-md text-[10px] uppercase ";
    if (status === "Aprobado") return base + "border-green-700 text-green-700 bg-green-50";
    if (status === "Rechazado") return base + "border-error text-error bg-error-container";
    return base + "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10";
  };

  return (
    <div className="flex h-screen bg-background text-on-surface font-body-md overflow-hidden relative">
      {/* Overlay para cerrar sidebar en móvil */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
        />
      )}

      {/* Navegación Lateral */}
      <aside className={`fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant flex flex-col z-20 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">palette</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm text-primary font-bold">Obsidian Gallery</h1>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Management</p>
            </div>
          </div>
          <nav className="space-y-1">
            <button onClick={() => { navigate("/admin"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 text-primary font-bold border-l-4 border-primary bg-surface-container-high transition-all">
              <span className="material-symbols-outlined">palette</span>
              <span className="font-label-md text-label-md uppercase">Artworks</span>
            </button>
            <button onClick={() => { navigate("/admin/artists"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 px-4 py-4 text-on-surface-variant hover:bg-surface-container-highest transition-all">
              <span className="material-symbols-outlined">person_outline</span>
              <span className="font-label-md text-label-md uppercase">Artists</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto px-8 py-10 border-t border-outline-variant space-y-4">
          <button onClick={() => navigate("/")} className="w-full py-4 bg-secondary text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-opacity-90 transition-colors">
            Publish Exhibition
          </button>
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-2 text-on-surface-variant hover:text-error transition-colors w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="ml-0 md:ml-[280px] flex-grow h-screen flex flex-col overflow-hidden w-full">
        <header className="h-16 flex justify-between items-center w-full px-margin-desktop bg-surface border-b border-outline-variant shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="md:hidden mr-4 text-primary focus:outline-none flex items-center"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-headline-md text-headline-md font-bold text-primary">Gallery Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex items-center bg-surface-container-low px-4 py-2 w-48 md:w-64">
              <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
              <input 
                type="text" 
                placeholder="Search artworks..." 
                className="bg-transparent border-none focus:ring-0 font-body-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant hidden sm:block">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIwm5c1dG6hz72cs8AXxhxff6P8cpsGKc1A02Gqyw7SbHUlN09vk2czqosm492j2JWuC76OZiOw4AXMMtbLNJnqPtg89Juy831D71U75-cM2MlDDgPGZCJF2fcqTX3pPgBdKlSkpUKE-MSX14I7zkVqMDqfkKxuRZrxc_Z5mSG5phQPP1uczf2fb6a26bGNKYUi7fBbgNsG3954ITdv-MxLeeoKiNMyeGmhWQWnxInGgMg9x28ymcmyVwh5NKEl_j5urnvqKXSIbM" className="w-full h-auto" />
            </div>
          </div>
        </header>

        <section className="flex-grow overflow-auto p-margin-desktop bg-background">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-display-lg text-display-lg text-primary mb-2">Artwork Inventory</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Manage the digital curation of the collection.</p>
              </div>
            </div>

            {/* Bento de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-10">
              <div className="bg-white border border-outline-variant p-6 shadow-sm">
                <span className="block font-label-md uppercase text-on-surface-variant mb-1">Total Collection</span>
                <span className="text-headline-lg font-headline-lg">{stats.totalCollection}</span>
              </div>
              <div className="bg-white border border-outline-variant p-6 shadow-sm">
                <span className="block font-label-md uppercase text-on-surface-variant mb-1">Pending Review</span>
                <span className="text-headline-lg font-headline-lg text-secondary">{stats.pendingReview}</span>
              </div>
              <div className="bg-white border border-outline-variant p-6 shadow-sm">
                <span className="block font-label-md uppercase text-on-surface-variant mb-1">Storage Used</span>
                <span className="text-headline-lg font-headline-lg">{stats.storageUsed}</span>
              </div>
            </div>

            {/* Tabla de Datos */}
            <div className="bg-white border border-outline-variant overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-primary text-on-primary font-label-md uppercase tracking-wider text-label-md">
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Artist</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Technique</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {Array.isArray(artworks) && artworks.filter(art => art?.title?.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center text-on-surface-variant italic">
                        {searchTerm ? 'No se encontraron obras con ese título.' : 'No hay obras en el inventario.'}
                      </td>
                    </tr>
                  )}
                  {Array.isArray(artworks) && artworks.filter(art => art?.title?.toLowerCase().includes(searchTerm.toLowerCase())).map(art => (
                    <tr key={art.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 border border-primary bg-surface-container overflow-hidden">
                          <img src={art.displayUrl} alt={art.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-headline-sm text-headline-sm text-primary">{art.title}</td>
                      <td className="px-6 py-4 font-body-md text-body-md">{art.artist?.full_name}</td>
                      <td className="px-6 py-4 font-body-sm text-body-sm">{art.creation_year}</td>
                      <td className="px-6 py-4 font-body-sm text-body-sm">{art.technique}</td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(art.status)}>{art.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2 items-center flex-wrap">
                        {art.status !== 'Aprobado' && (
                          <button 
                            onClick={() => handleApprove(art.id)} 
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 font-label-md uppercase text-[10px] tracking-wider rounded transition-colors"
                          >
                            Aprobar
                          </button>
                        )}
                        {art.status !== 'Rechazado' && (
                          <button 
                            onClick={() => handleRejectPrompt(art.id)} 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 font-label-md uppercase text-[10px] tracking-wider rounded transition-colors"
                          >
                            Rechazar
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteArtwork(art.id)} 
                          className="bg-black hover:bg-neutral-800 text-white px-3 py-1 font-label-md uppercase text-[10px] tracking-wider rounded transition-colors"
                        >
                          Eliminar
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/artwork/${art.id}`)} 
                          className="text-primary hover:underline font-label-md uppercase text-[10px] tracking-wider border border-primary px-3 py-1 rounded transition-colors ml-1"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}