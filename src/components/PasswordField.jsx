import { useState } from "react";

export default function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-end">
        <label
          className="font-label-md text-label-md text-on-surface-variant uppercase"
          htmlFor="password"
        >
          Access Key
        </label>
        <a
          className="font-label-md text-label-md text-secondary hover:underline"
          href="#"
        >
          Forgot?
        </a>
      </div>
      <div className="relative">
        <input
          className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary py-3 px-0 font-body-md text-body-md form-input-focus placeholder:opacity-30 transition-all"
          id="password"
          name="password"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          required
        />
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? "visibility" : "visibility_off"}
          </span>
        </button>
      </div>
    </div>
  );
}
