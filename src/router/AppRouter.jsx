import { Routes, Route } from "react-router-dom";
import About from "../components/About";
import { Hero } from "../components/Hero";
import { Filterbar } from "../components/FilterBar";
import { ArtworkGrid } from "../components/ArtworkGrid";
import { Newsletter } from "../components/Newsletter";
import { Leftsection } from "../components/LeftSection";
import { Rightsection } from "../components/RightSection";
import AdminDashboard from "../components/AdminDashboard";
import ArtistModule from "../components/ArtistModule";
import { ArtistGrid } from "../components/ArtistGrid";
import ArtistDetail from "../components/ArtistDetail";
import ArtistForm from "../components/ArtistForm";
import ArtworkDetail from "../components/ArtworkDetail";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

export function AppRouter({ role, setRole }) {
  return (
    <Routes>
      {/* Ruta principal que agrupa los componentes de la Landing Page */}
      <Route path="/" element={
        <>
          <Hero />
          <Filterbar />
          <ArtworkGrid />
          <Newsletter />
        </>
      } />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={
        <main className="flex min-h-screen pt-0">
          <Leftsection />
          <Rightsection role={role} setRole={setRole} />
        </main>
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin" element={<AdminDashboard setRole={setRole} />} />
      {/* Rutas para gestión de obras */}
      <Route path="/admin/artwork/:id" element={<ArtworkDetail />} />
      {/* Rutas para gestión de artistas */}
      <Route path="/admin/artists" element={<ArtistGrid />} />
      {/* Ruta para el módulo de artista (acceso directo para el rol Artista) */}
      <Route path="/artista" element={<ArtistModule setRole={setRole} />} />
      <Route path="/admin/artists/new" element={<ArtistForm />} />
      <Route path="/admin/artists/:id/edit" element={<ArtistForm />} />
      <Route path="/admin/artists/:id" element={<ArtistDetail />} />
      <Route path="/artwork/:id" element={<ArtworkDetail />} />
    </Routes>
  );
}