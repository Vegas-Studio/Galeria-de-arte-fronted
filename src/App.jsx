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
  const isLoginPage = location.pathname === "/login";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
      {!isLoginPage && !isAdminPage && <Navbar />}
      <main className={isLoginPage || isAdminPage ? "" : "pt-[90px]"}>
        <AppRouter role={role} setRole={setRole} />
      </main>
      {!isLoginPage && !isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  // Cambiamos el estado inicial a null o Visitante para forzar 
  // que el login defina el rol real basado en el token del backend.
  const [role, setRole] = useState(localStorage.getItem('token') ? 'admin' : 'Visitante');

  return (
    <Router>
      <AppContent role={role} setRole={setRole} />
    </Router>
  );
}

export default App;
