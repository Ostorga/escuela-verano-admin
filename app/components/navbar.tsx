"use client";

import { useState } from "react";
import { GraduationCap, LoaderCircle, LogOut, Menu } from "lucide-react";
import { useAuth } from "./auth-provider";

type NavbarProps = {
  onToggleMenu: () => void;
};

export default function Navbar({ onToggleMenu }: NavbarProps) {
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setSignOutError("No se pudo cerrar sesión. Inténtalo de nuevo.");
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#3D2D2E]/10 bg-[#3D2D2E]/50 text-[#3D2D2E] backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onToggleMenu} className="rounded-lg p-2 hover:bg-[#e3eee3] lg:hidden" aria-label="Abrir menú"><Menu size={21} /></button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ADEBB3]"><GraduationCap size={23} /></div>
          <div>
            <p className="text-[18px] font-bold tracking-tight">Verano<span className="font-normal">Admin</span></p>
            <p className="text-[13px] text-[#4c3b3c]">Panel de administración</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full bg-white/35 px-3 py-2 text-xs text-[#3D2D2E] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#65bd73]" /> Ciclo de verano 2026
          </div>
          <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#3D2D2E]/80 text-xs font-semibold text-white sm:flex">EBV</div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#3D2D2E]/15 bg-white/35 px-2.5 text-xs font-semibold transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
            aria-label="Cerrar sesión"
          >
            {signingOut ? <LoaderCircle size={15} className="animate-spin" /> : <LogOut size={15} />}
            <span className="hidden sm:inline">{signingOut ? "Saliendo..." : "Cerrar sesión"}</span>
          </button>
        </div>
      </div>
      {signOutError && (
        <p className="absolute right-4 top-full mt-2 rounded-lg border border-[#f0d7d7] bg-white px-3 py-2 text-xs text-[#8a3c3c] shadow-md" role="alert">
          {signOutError}
        </p>
      )}
    </header>
  );
}
