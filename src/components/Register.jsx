import { Link } from "react-router-dom";
import { BrandingHeader } from "./BrandingHeader";
import { EmailField } from "./EmailField";
import PasswordField from "./PasswordField";
import { Leftsection } from "./LeftSection";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          role_id: 2
        })
      });

      const result = await response.json();
      if (response.ok) {
        if (result.token) localStorage.setItem("token", result.token);
        alert("Cuenta creada exitosamente. Ya puedes iniciar sesión.");
        window.location.href = "/login";
      } else {
        alert(result.error || result.errors?.[0]?.msg || "Error al registrarse");
      }
    } catch {
      alert("Error de conexión con el servidor. Verifica VITE_API_URL y que el backend esté en línea.");
    }
  };

  return (
    <main className="flex min-h-screen pt-0">
      <Leftsection />
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
          <BrandingHeader />
          <h2 className="font-headline-md text-headline-md text-primary mb-8">Join as Artist</h2>

          <div className="space-y-1 mb-6">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="full_name">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary py-3 px-0 font-body-md text-body-md"
              placeholder="Nombre Apellido"
              type="text"
            />
          </div>

          <EmailField role="artista" />

          <div className="mt-6">
            <PasswordField />
          </div>

          <div className="space-y-1 mt-6">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
              className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary py-3 px-0 font-body-md text-body-md"
              placeholder="••••••••"
              type="password"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[56px] mt-8 bg-primary text-white font-label-md uppercase tracking-widest hover:bg-black transition-all"
          >
            Create Account
          </button>

          <p className="mt-8 text-center font-body-sm text-on-surface-variant">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
