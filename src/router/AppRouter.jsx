import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";
import { Hero } from "../components/Hero";
import { Filterbar } from "../components/FilterBar";
import { ArtworkGrid } from "../components/ArtworkGrid";
import { Newsletter } from "../components/Newsletter";
import { Leftsection } from "../components/LeftSection";
import { Rightsection } from "../components/RightSection";
import AdminDashboard from "../components/AdminDashboard";
import ArtworkDetail from "../components/ArtworkDetail";

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
      <Route path="/admin" element={<AdminDashboard setRole={setRole} />} />
      <Route path="/admin/artwork/:id" element={<ArtworkDetail />} />
      <Route path="/artwork/:id" element={<ArtworkDetail />} />
    </Routes>
  );
}