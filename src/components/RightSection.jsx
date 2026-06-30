import { BrandingHeader } from "./BrandingHeader";
import Toggle from "./Toggle";
import { EmailField } from "./EmailField";
import PasswordField from "./PasswordField";
import CtaActions from "./CtaActions";
import FooterLinks from "./FooterLinks";
import { useNavigate } from "react-router-dom";

export function Rightsection({ role, setRole }) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const loginData = { ...data, role };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      
      if (response.ok) {
        if (result.token) {
          localStorage.setItem('token', result.token);
        }

        // Obtenemos el rol del servidor y lo persistimos
        const userRole = result.role || result.user?.role || role;
        localStorage.setItem('userRole', userRole); 
        setRole(userRole);

        const lowerRole = userRole?.toLowerCase();

        // Lógica de redirección basada en el rol
        if (lowerRole === 'artista') {
          navigate("/artista");
        } else if (lowerRole === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        alert(result.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error al conectar con el servidor. Revisa si el backend está encendido.");
    }
  };

  return (
    <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
      <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
        <BrandingHeader />
        <Toggle role={role} setRole={setRole} />
        <EmailField role={role} />
        <PasswordField />
        <CtaActions role={role} />
        <FooterLinks />
      </form>
    </section>
  );
}