import { useNavigate } from "react-router-dom";

function Home({ role }) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-margin-desktop py-20 text-center">
      <h1 className="font-display-lg text-display-lg mb-4">Página de Inicio</h1>
      <p className="font-body-lg text-on-surface-variant mb-8">
        Bienvenido a nuestra aplicación. Estás logueado como <span className="font-bold text-primary uppercase">{role}</span>.
      </p>
      
      {role === 'admin' && (
        <button 
          onClick={() => navigate('/admin')}
          className="bg-primary text-white px-8 py-4 font-label-md text-label-md uppercase tracking-widest hover:bg-black transition-all"
        >
          Ir al Panel de Administración
        </button>
      )}
    </div>
  );
}
export default Home;