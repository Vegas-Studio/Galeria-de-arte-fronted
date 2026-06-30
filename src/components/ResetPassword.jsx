import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BrandingHeader } from "./BrandingHeader";
import { Leftsection } from "./LeftSection";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password })
      });

      const result = await response.json();
      if (response.ok) {
        setDone(true);
      } else {
        alert(result.error || result.errors?.[0]?.msg || "Error al restablecer la contraseña");
      }
    } catch {
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <main className="flex min-h-screen pt-0">
        <Leftsection />
        <section className="w-full lg:w-1/2 flex items-center justify-center px-margin-desktop bg-surface-container-lowest">
          <div className="max-w-[440px] text-center">
            <p className="font-body-md text-on-surface-variant mb-6">
              Enlace inválido o incompleto. Solicita uno nuevo desde la página de recuperación.
            </p>
            <Link to="/forgot-password" className="text-primary font-bold hover:underline">
              Solicitar nuevo enlace
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen pt-0">
      <Leftsection />
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
          <BrandingHeader />
          <h2 className="font-headline-md text-headline-md text-primary mb-8">Reset Password</h2>

          {done ? (
            <div className="p-6 border border-outline-variant bg-surface-container-low">
              <p className="font-body-md mb-4">Contraseña actualizada correctamente.</p>
              <Link to="/login" className="text-primary font-bold hover:underline">
                Ir al login
              </Link>
            </div>
          ) : (
            <>
              <input type="hidden" name="email" value={email} />
              <div className="space-y-1 mb-6">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="password">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  type="password"
                  className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary py-3 px-0 font-body-md text-body-md"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1 mb-8">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  minLength={6}
                  type="password"
                  className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary py-3 px-0 font-body-md text-body-md"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] bg-primary text-white font-label-md uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Actualizar contraseña"}
              </button>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
