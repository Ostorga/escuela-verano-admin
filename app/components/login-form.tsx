"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, GraduationCap, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { getAuthErrorMessage } from "../lib/firebase/auth-errors";
import { useAuth } from "./auth-provider";

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email.trim(), password);
    } catch (authError) {
      console.error("Error al iniciar sesión:", authError);
      setError(getAuthErrorMessage(authError));
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-5xl items-center justify-center gap-10 lg:grid-cols-[minmax(300px,0.85fr)_440px] lg:gap-16">
        <aside className="hidden items-center justify-center lg:flex" aria-hidden="true">
          <div className="relative aspect-video w-full max-w-[420px] overflow-hidden bg-[#f7f1e6] lg:max-w-[500px]">
            <video
              src="/images/login-background.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 block h-full w-full object-cover [transform:translateZ(0)]"
            />
          </div>
        </aside>

      <div className="w-full max-w-[440px] justify-self-center">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ADEBB3] text-[#3D2D2E]">
            <GraduationCap size={27} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8d8182]">
            Escuela de Verano · 2026
          </p>
        </div>

        <section className="rounded-2xl border border-[#dfe5df] bg-white p-6 shadow-[0_8px_30px_rgba(45,65,45,0.09)] sm:p-9">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-[#3D2D2E] sm:text-[28px]">
              Bienvenido de nuevo
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#8b8080]">
              Ingresa tus credenciales para acceder al panel administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#3D2D2E]">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9b9091]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  autoFocus
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="form-input !pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#3D2D2E]">
                Contraseña
              </label>
              <div className="relative">
                <LockKeyhole size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9b9091]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="form-input !pl-10 !pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8b8080] transition hover:bg-[#f6f8f6] hover:text-[#3D2D2E] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#83d58e]"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={showPassword}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-[#f0d7d7] bg-[#fff7f7] px-3.5 py-3 text-sm text-[#8a3c3c]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3D2D2E] px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(61,45,46,0.22)] transition hover:bg-[#261a1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83d58e] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <LoaderCircle size={17} className="animate-spin" />}
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-[#aaa1a1]">
          Acceso exclusivo para administración
        </p>
      </div>
      </div>
    </main>
  );
}
