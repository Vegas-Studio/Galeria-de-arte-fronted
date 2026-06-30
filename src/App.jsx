import { Footer } from "./components/Footer";
import { Navbar } from "./components/NavBar";
import { useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AppRouter } from "./router/AppRouter";

/**
 * Componente auxiliar para manejar la visibilidad de elementos 
 * basados en la ruta actual (necesita estar dentro de <Router>)
 */
function AppContent({ role, setRole }) {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const isArtistPage = location.pathname === "/artista";

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
      {!isAuthPage && !isAdminPage && !isArtistPage && <Navbar />}
      <main className={isAuthPage || isAdminPage || isArtistPage ? "" : "pt-[90px]"}>
        <AppRouter role={role} setRole={setRole} />
      </main>
      {!isAuthPage && !isAdminPage && !isArtistPage && <Footer />}
    </div>
  );
}

function App() {
  // Cambiamos el estado inicial a null o Visitante para forzar 
  // que el login defina el rol real basado en el token del backend.
  // Lo ideal es recuperar el rol guardado en localStorage tras el login
  const savedRole = localStorage.getItem('userRole') || 'Visitante';
  const [role, setRole] = useState(savedRole);

  return (
    <Router>
      <AppContent role={role} setRole={setRole} />
    </Router>
  );
}

export default App;
