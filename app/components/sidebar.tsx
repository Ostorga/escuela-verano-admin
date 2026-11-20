"use client";

import { BookOpen, ChevronRight, LayoutDashboard } from "lucide-react";

type SidebarProps = {
  mobileNav: boolean;
  sidebarCollapsed: boolean;
  studentCount: number;
  onCloseMobileNav: () => void;
  onToggleCollapsed: () => void;
};

export default function Sidebar({
  mobileNav,
  sidebarCollapsed,
  studentCount,
  onCloseMobileNav,
  onToggleCollapsed
}: SidebarProps) {
  return (
    <>
      {mobileNav && <button className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={onCloseMobileNav} aria-label="Cerrar menú" />}
      <aside className={`${mobileNav ? "translate-x-0" : "-translate-x-full"} fixed bottom-0 left-0 top-[76px] z-30 flex w-[250px] flex-col border-r border-[#e8eee8] bg-white p-5 transition-all duration-300 ease-in-out lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] lg:translate-x-0 ${sidebarCollapsed ? "lg:w-0 lg:overflow-visible lg:border-r-0 lg:p-0" : "lg:w-[250px]"}`}>
        {(!sidebarCollapsed || mobileNav) && (
          <>
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#a19898]">Espacio de trabajo</p>
            <button className="flex items-center gap-3 rounded-xl bg-[#ADEBB3]/45 px-3 py-3 text-left text-sm font-semibold text-[#3D2D2E]">
              <LayoutDashboard size={18} /> Inscripciones
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px]">{studentCount}</span>
            </button>
            <div className="mt-auto rounded-2xl bg-[#f6f8f6] p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white"><BookOpen size={18} /></div>
              <p className="text-sm font-semibold">Escuela de verano</p>
              <p className="mt-1 text-xs leading-5 text-[#8b8080]">Administra las inscripciones y lleva el control de los talleres.</p>
            </div>
          </>
        )}
      </aside>
      <button
        onClick={onToggleCollapsed}
        style={{ left: sidebarCollapsed ? 16 : 190 }}
        className="fixed top-[81px] z-40 hidden h-11 w-11 items-center justify-center rounded-xl bg-[#3D2D2E]/80 text-white shadow-sm transition-[left,background-color] duration-300 ease-in-out hover:bg-[#261a1b]/90 lg:flex"
        aria-label={sidebarCollapsed ? "Abrir menú lateral" : "Cerrar menú lateral"}
        aria-expanded={!sidebarCollapsed}
      >
        <ChevronRight size={24} className={`transition-transform duration-300 ease-in-out ${sidebarCollapsed ? "rotate-180" : ""}`} />
      </button>
    </>
  );
}
