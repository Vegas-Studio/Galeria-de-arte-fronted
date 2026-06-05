import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ setRole }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createdUrls = [];

    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("https://galeria-de-arte-backend.onrender.com/api/artworks", {
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
              // Soporte para Base64
              displayUrl = `data:image/jpeg;base64,${art.original_image}`;
            } else if (art.original_image.data || Array.isArray(art.original_image)) {
              const binaryData = art.original_image.data || art.original_image;
              const blob = new Blob([new Uint8Array(binaryData)], { type: 'image/jpeg' });
              displayUrl = URL.createObjectURL(blob);
              createdUrls.push(displayUrl);
            }
          }
          return { ...art, displayUrl };
        });

        setArtworks(processed);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();

    return () => {
      createdUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
    navigate("/login");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch("https://galeria-de-arte-backend.onrender.com/api/artworks", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
          // No incluir Content-Type: multipart/form-data, el navegador lo hace automáticamente con FormData
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert("Obra creada exitosamente");
        setIsModalOpen(false);
        // Recargar inventario
        window.location.reload();
      } else {
        alert(result.error || result.errors?.[0]?.msg || "Error al subir obra");
      }
    } catch (error) {
      console.error("Error en upload:", error);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 border font-label-md text-[10px] uppercase ";
    if (status === "Aprobado") return base + "border-green-700 text-green-700 bg-green-50";
    if (status === "Rechazado") return base + "border-error text-error bg-error-container";
    return base + "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10";
  };

  return (
    <div className="flex h-screen bg-background text-on-surface font-body-md overflow-hidden relative">
      {/* Navegación Lateral */}
      <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant flex flex-col z-20 transition-transform duration-300">
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
            <button onClick={() => navigate("/admin")} className="w-full flex items-center gap-4 px-4 py-4 text-primary font-bold border-l-4 border-primary bg-surface-container-high transition-all">
              <span className="material-symbols-outlined">palette</span>
              <span className="font-label-md text-label-md uppercase">Artworks</span>
            </button>
            <button onClick={() => alert("Módulo de artistas en desarrollo")} className="w-full flex items-center gap-4 px-4 py-4 text-on-surface-variant hover:bg-surface-container-highest transition-all">
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
      <main className="ml-[280px] flex-grow h-screen flex flex-col overflow-hidden">
        <header className="h-16 flex justify-between items-center w-full px-margin-desktop bg-surface border-b border-outline-variant shrink-0">
          <span className="font-headline-md text-headline-md font-bold text-primary">Gallery Admin</span>
          <div className="flex items-center gap-6">
            <div className="relative flex items-center bg-surface-container-low px-4 py-2 w-64">
              <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
              <input 
                type="text" 
                placeholder="Search artworks..." 
                className="bg-transparent border-none focus:ring-0 font-body-sm w-full"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
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
              <button onClick={() => setIsModalOpen(true)} className="bg-primary text-on-primary px-8 py-4 font-label-md text-label-md uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-80 transition-all shadow-md">
                <span className="material-symbols-outlined">add</span> Upload New Work
              </button>
            </div>

            {/* Bento de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-10">
              <div className="bg-white border border-outline-variant p-6 shadow-sm">
                <span className="block font-label-md uppercase text-on-surface-variant mb-1">Total Collection</span>
                <span className="text-headline-lg font-headline-lg">1,248</span>
              </div>
              <div className="bg-white border border-outline-variant p-6 shadow-sm">
                <span className="block font-label-md uppercase text-on-surface-variant mb-1">Pending Review</span>
                <span className="text-headline-lg font-headline-lg text-secondary">24</span>
              </div>
              <div className="bg-white border border-outline-variant p-6 shadow-sm">
                <span className="block font-label-md uppercase text-on-surface-variant mb-1">Storage Used</span>
                <span className="text-headline-lg font-headline-lg">64%</span>
              </div>
            </div>

            {/* Tabla de Datos */}
            <div className="bg-white border border-outline-variant overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary text-on-primary font-label-md uppercase tracking-wider text-label-md">
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Artist</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
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
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/admin/artwork/${art.id}`)} 
                          className="text-primary hover:underline font-label-md uppercase text-label-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Subida */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-2xl shadow-xl">
            <div className="p-8 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary font-bold uppercase">Upload New Work</h3>
              <button onClick={() => setIsModalOpen(false)} className="material-symbols-outlined hover:bg-surface-container-low p-2">close</button>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleUpload}>
              <div className="grid grid-cols-2 gap-gutter">
                <div className="space-y-4">
                  <div>
                    <label className="block font-label-md text-[10px] uppercase text-on-surface-variant">Artwork Title</label>
                    <input name="title" required className="w-full border-b border-primary py-2 bg-transparent" placeholder="e.g. Midnight Solace" />
                  </div>
                  <div>
                    <label className="block font-label-md text-[10px] uppercase text-on-surface-variant">Creation Year</label>
                    <input name="creation_year" type="number" required className="w-full border-b border-primary py-2 bg-transparent" placeholder="2024" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-label-md text-[10px] uppercase text-on-surface-variant">Technique</label>
                    <input name="technique" required className="w-full border-b border-primary py-2 bg-transparent" placeholder="Oil on Canvas" />
                  </div>
                  <div>
                    <label className="block font-label-md text-[10px] uppercase text-on-surface-variant">Dimensions</label>
                    <input name="dimensions" required className="w-full border-b border-primary py-2 bg-transparent" placeholder="120 x 180 cm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-[10px] uppercase text-on-surface-variant mb-2">Artwork Image</label>
                <div className="border-2 border-dashed border-outline-variant p-8 text-center hover:border-primary transition-all relative">
                  <input 
                    type="file" 
                    name="image" 
                    required 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">cloud_upload</span>
                  <p className="font-body-sm text-on-surface-variant mt-2">
                    Click or drag image here (Max 10MB)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border border-primary font-label-md uppercase tracking-wider">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-secondary text-on-primary font-label-md uppercase tracking-wider">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}