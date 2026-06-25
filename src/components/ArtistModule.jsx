import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArtistModule({ setRole }) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('published');
    const [currentView, setCurrentView] = useState('artworks');
    const [artworks, setArtworks] = useState([]);
    const [loadingArtworks, setLoadingArtworks] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const [expandedMessageId, setExpandedMessageId] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    const [profileData, setProfileData] = useState({
        id: null,
        fullName: "",
        nationality: "",
        bio: "",
        email: "",
        avatarUrl: null
    });

    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // 1. Fetch Profile
            const profileResponse = await fetch(`${API_URL}/profile`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!profileResponse.ok) throw new Error('Error al cargar perfil');
            const profile = await profileResponse.json();
            
            const fullName = [profile.nombre, profile.apellido].filter(Boolean).join(' ');
            setProfileData({
                id: profile.id,
                fullName,
                nationality: profile.nationality || '',
                bio: profile.biography || '',
                email: profile.email || '',
                avatarUrl: profile.avatar || null
            });

            // 2. Fetch Artworks for this artist
            const artworksResponse = await fetch(`${API_URL}/artworks?artist_id=${profile.id}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (artworksResponse.ok) {
                const artworksData = await artworksResponse.json();
                const raw = Array.isArray(artworksData) ? artworksData : [];
                const processed = raw.map(art => {
                    let displayUrl = 'https://placehold.co/400x500?text=Sin+Imagen';
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
            }

            // 3. Fetch Messages/Notifications
            const messagesResponse = await fetch(`${API_URL}/profile/messages`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (messagesResponse.ok) {
                const messagesData = await messagesResponse.json();
                setMessages(Array.isArray(messagesData) ? messagesData : []);
            }

        } catch (err) {
            console.error('Error cargando datos del panel de artista:', err);
        } finally {
            setLoadingArtworks(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Enviar nueva obra al backend con captura y validación
    const handleSubmitArtwork = async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const fileInput = form.querySelector('input[type="file"]');
        const file = fileInput?.files[0];
        
        if (!file) {
            alert('Por favor selecciona una imagen para la obra.');
            return;
        }

        // Validación
        if (!file.type.startsWith('image/')) {
            alert('El archivo debe ser una imagen válida (JPEG, PNG, etc.).');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('La imagen no debe superar los 10MB.');
            return;
        }

        setSubmitLoading(true);
        const token = localStorage.getItem('token');
        const formData = new FormData(form);

        try {
            const response = await fetch(`${API_URL}/artworks`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                alert('Obra enviada exitosamente. Está pendiente de revisión curatorial.');
                setIsModalOpen(false);
                setSelectedFileName('');
                fetchAllData();
            } else {
                alert(result.error || result.errors?.[0]?.msg || 'Error al enviar obra');
            }
        } catch (err) {
            console.error('Error enviando obra:', err);
            alert('Error de conexión al enviar la obra.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const nameParts = profileData.fullName.trim().split(/\s+/);
            const nombre = nameParts[0] || '';
            const apellido = nameParts.slice(1).join(' ') || '';

            const response = await fetch(`${API_URL}/profile_update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    biography: profileData.bio,
                    nationality: profileData.nationality
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Perfil actualizado exitosamente');
                setProfileData({
                    id: result.user.id,
                    fullName: [result.user.nombre, result.user.apellido].filter(Boolean).join(' '),
                    nationality: result.user.nationality || '',
                    bio: result.user.biography || '',
                    email: result.user.email || '',
                    avatarUrl: result.user.avatar || null
                });
            } else {
                alert(result.error || 'Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            alert('Error de conexión al actualizar el perfil.');
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no debe superar los 5MB.');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/profile_update/avatar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                alert('Avatar actualizado exitosamente');
                setProfileData(prev => ({
                    ...prev,
                    avatarUrl: result.user.avatar
                }));
            } else {
                alert(result.error || 'Error al actualizar el avatar');
            }
        } catch (error) {
            console.error('Error actualizando avatar:', error);
            alert('Error de conexión al actualizar el avatar.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setRole('Visitante');
        navigate('/login');
    };

    const filteredArtworks = artworks
        .filter(art => activeTab === 'published' ? art.status === 'Aprobado' : art.status !== 'Aprobado')
        .filter(art => art.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const publishedCount = artworks.filter(art => art.status === 'Aprobado').length;
    const pendingCount = artworks.filter(art => art.status === 'Pendiente').length;
    const rejectedCount = artworks.filter(art => art.status === 'Rechazado').length;

    return (
        <div className="font-body-md text-body-md bg-background min-h-screen">
            {/* Sidebar Navigation */}
            <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant flex flex-col py-unit z-50">
                <div className="px-6 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-primary">palette</span>
                        </div>
                        <h1 className="font-headline-sm text-headline-sm text-primary">Obsidian Gallery</h1>
                    </div>
                    <p className="text-on-surface-variant font-label-md uppercase tracking-wider text-[10px]">Exhibition Management</p>
                </div>
                <nav className="flex-grow px-4 space-y-1">
                    <button 
                        onClick={() => setCurrentView('artworks')}
                        className={`w-full flex items-center gap-4 px-4 py-3 transition-all ${currentView === 'artworks' ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
                    >
                        <span className="material-symbols-outlined">palette</span>
                        <span className="font-label-md uppercase">Artworks</span>
                    </button>
                    <button 
                        onClick={() => setCurrentView('profile')}
                        className={`w-full flex items-center gap-4 px-4 py-3 transition-all ${currentView === 'profile' ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
                    >
                        <span className="material-symbols-outlined">person_outline</span>
                        <span className="font-label-md uppercase">Profile</span>
                    </button>
                    <button 
                        onClick={() => setCurrentView('messages')}
                        className={`w-full flex items-center gap-4 px-4 py-3 transition-all ${currentView === 'messages' ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
                    >
                        <span className="material-symbols-outlined">mail</span>
                        <span className="font-label-md uppercase">Messages</span>
                    </button>
                </nav>
                <footer className="px-4 pt-4 border-t border-outline-variant space-y-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-label-md uppercase">Logout</span>
                    </button>
                </footer>
            </aside>

            {/* Main Content */}
            <main className="ml-[280px] min-h-screen px-margin-desktop overflow-y-auto">
                <header className="sticky top-0 bg-surface/80 backdrop-blur-md z-40 border-b border-outline-variant h-16 flex justify-between items-center w-full">
                    <h2 className="font-headline-md text-headline-md font-bold text-primary">Artist Panel</h2>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center bg-surface-container-low px-4 py-2 border border-outline-variant group">
                            <span className="material-symbols-outlined text-on-surface-variant mr-2 group-focus-within:text-primary">search</span>
                            <input 
                                className="bg-transparent border-none focus:ring-0 text-body-sm w-48" 
                                placeholder="Search collection..." 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative flex items-center">
                                <span 
                                    onClick={() => setCurrentView('messages')}
                                    className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors text-2xl"
                                >
                                    notifications
                                </span>
                                {messages.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                        {messages.length}
                                    </span>
                                )}
                            </div>
                            <div className="w-8 h-8 bg-surface-container-highest rounded-full flex items-center justify-center overflow-hidden border border-outline-variant">
                                {profileData.avatarUrl ? (
                                    <img alt="Profile" className="w-full h-full object-cover" src={profileData.avatarUrl} />
                                ) : (
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Views */}
                {currentView === 'artworks' && (
                    <>
                        {/* Portfolio Header */}
                        <section className="py-12 flex flex-col md:flex-row justify-between items-end border-b border-outline-variant">
                            <div className="space-y-4">
                                <h1 className="font-display-lg text-display-lg text-primary">My Portfolio</h1>
                                <div className="flex gap-12">
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-on-surface-variant uppercase tracking-widest">Total Works</span>
                                        <span className="font-headline-lg text-headline-lg">{artworks.length}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-on-surface-variant uppercase tracking-widest">Published</span>
                                        <span className="font-headline-lg text-headline-lg">{publishedCount}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-on-surface-variant uppercase tracking-widest text-secondary">Pending Approval</span>
                                        <span className="font-headline-lg text-headline-lg text-secondary">{pendingCount}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="px-8 py-4 bg-primary text-on-primary font-label-md uppercase tracking-widest hover:bg-on-surface-variant transition-colors active:scale-95"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Submit New Artwork
                            </button>
                        </section>

                        {/* Tabs */}
                        <section className="mt-8">
                            <div className="flex border-b border-outline-variant mb-gutter">
                                <button 
                                    onClick={() => setActiveTab('published')}
                                    className={`px-8 py-4 font-label-md uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'published' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
                                >
                                    Published ({publishedCount})
                                </button>
                                <button 
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-8 py-4 font-label-md uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
                                >
                                    Pending / Feedback ({pendingCount + rejectedCount})
                                </button>
                            </div>

                            {/* Artwork Grid */}
                            {loadingArtworks ? (
                                <div className="text-center py-20 font-label-md">Cargando portfolio...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter pb-24">
                                    {filteredArtworks.map(art => (
                                            <article key={art.id} className="bg-surface border border-outline-variant group">
                                                <div className="aspect-[4/5] overflow-hidden bg-surface-container relative">
                                                    <img
                                                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${art.status !== 'Aprobado' ? 'opacity-60' : ''}`}
                                                        src={art.displayUrl}
                                                        alt={art.title}
                                                    />
                                                    {art.status === 'Pendiente' && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="bg-white/90 border border-secondary px-4 py-2 flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-secondary">hourglass_empty</span>
                                                                <span className="font-label-md text-secondary uppercase">Curatorial Review</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-headline-sm text-headline-sm text-primary">{art.title}</h3>
                                                        <span className={`px-2 py-1 border font-label-md text-[10px] uppercase ${
                                                            art.status === 'Aprobado' ? 'border-[#2e7d32] bg-[#f1f8e9] text-[#2e7d32]' :
                                                            art.status === 'Rechazado' ? 'border-red-700 bg-red-50 text-red-700' :
                                                            'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                                                        }`}>{art.status}</span>
                                                    </div>
                                                    <p className="font-body-sm text-on-surface-variant mb-4">{art.technique}, {art.creation_year}</p>
                                                    <div className="flex justify-between items-center border-t border-outline-variant pt-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">visibility</span>
                                                            <span className="font-data-mono text-data-mono">{art.ArtworkStat?.view_count ?? 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">file_download</span>
                                                            <span className="font-data-mono text-data-mono">{art.ArtworkStat?.download_count ?? 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))
                                    }
                                    {filteredArtworks.length === 0 && (
                                        <div className="col-span-full text-center py-20 border border-dashed border-outline-variant">
                                            <p className="font-body-lg text-on-surface-variant italic">
                                                {searchTerm
                                                    ? 'No se encontraron obras con ese título.'
                                                    : activeTab === 'published'
                                                        ? 'No tienes obras aprobadas.'
                                                        : 'No tienes obras pendientes o con feedback.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}

                {currentView === 'profile' && (
                    <section className="py-12">
                        <h1 className="font-display-lg text-display-lg text-primary mb-8">Artist Profile</h1>
                        <form onSubmit={handleUpdateProfile} className="bg-surface border border-outline-variant p-10 max-w-3xl space-y-10">
                            <div className="flex items-center gap-8 border-b border-outline-variant pb-8">
                                <div className="w-32 h-32 bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant flex items-center justify-center">
                                    {profileData.avatarUrl ? (
                                        <img alt="Profile" className="w-full h-full object-cover" src={profileData.avatarUrl} />
                                    ) : (
                                        <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
                                    )}
                                </div>
                                <div>
                                    <label className="px-6 py-2 border border-primary font-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer inline-block">
                                        Change Avatar
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleAvatarChange} 
                                            className="hidden" 
                                        />
                                    </label>
                                    <p className="text-[11px] font-label-md text-on-surface-variant mt-2 uppercase tracking-wider">Recommended: 400x400px</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="font-label-md uppercase tracking-widest text-[10px]">Full Name</label>
                                    <input 
                                        className="w-full border-b border-outline focus:border-primary border-t-0 border-l-0 border-r-0 bg-transparent py-2 focus:ring-0" 
                                        type="text" 
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md uppercase tracking-widest text-[10px]">Nationality</label>
                                    <input 
                                        className="w-full border-b border-outline focus:border-primary border-t-0 border-l-0 border-r-0 bg-transparent py-2 focus:ring-0" 
                                        type="text"
                                        value={profileData.nationality}
                                        onChange={(e) => setProfileData({...profileData, nationality: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-label-md uppercase tracking-widest text-[10px]">Artist Biography</label>
                                    <textarea 
                                        className="w-full border border-outline-variant focus:border-primary bg-transparent p-4 focus:ring-0" 
                                        rows="5"
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="px-10 py-4 bg-primary text-on-primary font-label-md uppercase tracking-widest hover:bg-on-surface-variant transition-colors">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {currentView === 'messages' && (
                    <section className="py-12">
                        <div className="flex justify-between items-end mb-8">
                            <h1 className="font-display-lg text-display-lg text-primary">Messages</h1>
                            <span className="font-label-md text-on-surface-variant uppercase tracking-widest">Inbox — {messages.length} Conversations</span>
                        </div>
                        <div className="bg-surface border border-outline-variant overflow-hidden shadow-sm">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                                    className={`p-6 border-b border-outline-variant last:border-0 hover:bg-surface-container-low cursor-pointer transition-colors ${!msg.read ? 'bg-surface-container-lowest border-l-4 border-l-primary' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-6">
                                            <span className={`material-symbols-outlined ${!msg.read ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                {msg.artworkStatus === 'Aprobado' ? 'check_circle' : msg.artworkStatus === 'Rechazado' ? 'cancel' : 'mail'}
                                            </span>
                                            <div>
                                                <h3 className={`font-headline-sm text-body-md ${!msg.read ? 'font-bold' : ''}`}>{msg.sender}</h3>
                                                <p className="text-on-surface-variant text-body-sm italic">{msg.subject}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-data-mono text-[11px] text-on-surface-variant uppercase tracking-tighter">{msg.date}</p>
                                            {!msg.read && <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1"></span>}
                                        </div>
                                    </div>
                                    {expandedMessageId === msg.id && (
                                        <div className="mt-4 ml-14 p-4 bg-white border border-outline-variant text-body-sm text-on-surface">
                                            <p className="mb-2"><strong>Obra:</strong> {msg.artworkTitle}</p>
                                            <p><strong>Mensaje:</strong> {msg.message}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="p-20 text-center text-on-surface-variant font-body-lg italic">
                                    No messages available.
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-gutter" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white text-neutral-900 w-full max-w-2xl border border-neutral-200 flex flex-col max-h-[90vh] shadow-2xl rounded-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="p-8 border-b border-neutral-200 flex justify-between items-center bg-white">
                            <h2 className="font-headline-md text-headline-md text-primary font-bold">Submit New Artwork</h2>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="material-symbols-outlined cursor-pointer hover:rotate-90 transition-transform text-neutral-500">close</button>
                        </div>
                        <form onSubmit={handleSubmitArtwork} className="p-8 overflow-y-auto custom-scrollbar space-y-8 bg-white">
                            <div className="group border-2 border-dashed border-neutral-300 p-8 text-center hover:border-primary transition-colors cursor-pointer relative bg-white">
                                <input
                                    type="file"
                                    name="image"
                                    required
                                    accept="image/*"
                                    onChange={(e) => setSelectedFileName(e.target.files[0]?.name || '')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <span className="material-symbols-outlined text-4xl mb-4 text-neutral-500 group-hover:text-primary">upload_file</span>
                                <p className="font-body-md text-neutral-700">Drag and drop or <span className="text-primary font-bold">browse</span> (Max 10MB)</p>
                                {selectedFileName && (
                                    <p className="mt-2 text-sm text-primary font-semibold">Archivo seleccionado: {selectedFileName}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-gutter">
                                <div className="space-y-2">
                                    <label className="font-label-md uppercase tracking-widest text-[10px] text-neutral-700 font-bold">Artwork Title</label>
                                    <input name="title" required className="w-full border-b border-neutral-300 focus:border-primary border-t-0 border-l-0 border-r-0 bg-white py-2 focus:ring-0 text-neutral-900" placeholder="e.g. Echoes of Midnight" type="text" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md uppercase tracking-widest text-[10px] text-neutral-700 font-bold">Technique</label>
                                    <input name="technique" required className="w-full border-b border-neutral-300 focus:border-primary border-t-0 border-l-0 border-r-0 bg-white py-2 focus:ring-0 text-neutral-900" placeholder="Oil on Canvas" type="text" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md uppercase tracking-widest text-[10px] text-neutral-700 font-bold">Year</label>
                                    <input name="creation_year" required type="number" className="w-full border-b border-neutral-300 focus:border-primary border-t-0 border-l-0 border-r-0 bg-white py-2 focus:ring-0 text-neutral-900" placeholder="2024" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md uppercase tracking-widest text-[10px] text-neutral-700 font-bold">Dimensions</label>
                                    <input name="dimensions" required className="w-full border-b border-neutral-300 focus:border-primary border-t-0 border-l-0 border-r-0 bg-white py-2 focus:ring-0 text-neutral-900" placeholder="100 x 120 cm" type="text" />
                                </div>
                            </div>
                            <div className="p-8 border-t border-neutral-200 flex justify-end gap-6 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 font-label-md uppercase tracking-widest text-neutral-600 hover:text-primary transition-colors">Cancel</button>
                                <button type="submit" disabled={submitLoading} className="px-8 py-3 bg-primary text-on-primary font-label-md uppercase tracking-widest hover:bg-opacity-95 transition-colors disabled:opacity-50">
                                    {submitLoading ? 'Sending...' : 'Submit for Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
