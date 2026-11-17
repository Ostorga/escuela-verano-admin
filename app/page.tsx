"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Plus, MoreHorizontal, Pencil, Trash2, Users, LayoutDashboard,
  ChevronLeft, ChevronRight, X, Check, GraduationCap, Menu, Filter,
  CalendarDays, BookOpen, CheckCircle2, Clock3
} from "lucide-react";

type Student = {
  id: number;
  childName: string;
  parentName: string;
  paid: boolean;
  workshop: string;
};

const STORAGE_KEY = "summer-school-students-v1";
const WORKSHOPS = ["Arte y creatividad", "Fútbol", "Danza", "Ciencia divertida", "Música", "Manualidades"];

const initialStudents: Student[] = [
  { id: 1, childName: "Sofía Martínez", parentName: "Carlos Martínez", paid: true, workshop: "Arte y creatividad" },
  { id: 2, childName: "Mateo Hernández", parentName: "Ana Hernández", paid: true, workshop: "Fútbol" },
  { id: 3, childName: "Valentina López", parentName: "José López", paid: false, workshop: "Danza" },
  { id: 4, childName: "Sebastián Rivera", parentName: "María Rivera", paid: true, workshop: "Ciencia divertida" },
  { id: 5, childName: "Isabella Flores", parentName: "Pedro Flores", paid: false, workshop: "Música" },
  { id: 6, childName: "Diego Ramírez", parentName: "Laura Ramírez", paid: true, workshop: "Fútbol" },
  { id: 7, childName: "Camila Torres", parentName: "Ricardo Torres", paid: true, workshop: "Manualidades" },
  { id: 8, childName: "Daniel García", parentName: "Patricia García", paid: false, workshop: "Arte y creatividad" },
  { id: 9, childName: "Luciana Cruz", parentName: "Miguel Cruz", paid: true, workshop: "Danza" },
  { id: 10, childName: "Gabriel Reyes", parentName: "Elena Reyes", paid: true, workshop: "Ciencia divertida" },
  { id: 11, childName: "Emma Aguilar", parentName: "Francisco Aguilar", paid: false, workshop: "Música" },
  { id: 12, childName: "Nicolás Castro", parentName: "Verónica Castro", paid: true, workshop: "Fútbol" }
];

export default function Home() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState({ childName: "", parentName: "", paid: false, workshop: WORKSHOPS[0] });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setStudents(JSON.parse(saved) as Student[]);
    } catch { /* Si los datos locales no se pueden leer, se usan los datos de ejemplo. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students, ready]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setActiveMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = useMemo(() => students.filter((student) => {
    const term = search.toLowerCase().trim();
    const matchesSearch = student.childName.toLowerCase().includes(term) || student.parentName.toLowerCase().includes(term);
    const matchesPayment = paymentFilter === "all" || (paymentFilter === "paid" ? student.paid : !student.paid);
    return matchesSearch && matchesPayment;
  }), [students, search, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const visibleStudents = filtered.slice((page - 1) * 10, page * 10);
  const paidCount = students.filter((student) => student.paid).length;
  const unpaidCount = students.length - paidCount;

  useEffect(() => { setPage(1); }, [search, paymentFilter]);

  function openCreate() {
    setEditing(null);
    setForm({ childName: "", parentName: "", paid: false, workshop: WORKSHOPS[0] });
    setModalOpen(true);
  }

  function openEdit(student: Student) {
    setEditing(student);
    setForm({ childName: student.childName, parentName: student.parentName, paid: student.paid, workshop: student.workshop });
    setActiveMenu(null);
    setModalOpen(true);
  }

  function saveStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const childName = form.childName.trim();
    const parentName = form.parentName.trim();
    if (!childName || !parentName) return;
    if (editing) {
      setStudents((current) => current.map((student) => student.id === editing.id ? { ...student, ...form, childName, parentName } : student));
    } else {
      setStudents((current) => [{ ...form, childName, parentName, id: Date.now() }, ...current]);
      setPage(1);
    }
    setModalOpen(false);
  }

  function deleteStudent(student: Student) {
    if (window.confirm(`¿Seguro que deseas eliminar la inscripción de ${student.childName}?`)) {
      setStudents((current) => current.filter((item) => item.id !== student.id));
      setActiveMenu(null);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#e8eee8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(!mobileNav)} className="rounded-lg p-2 hover:bg-[#f2f7f2] lg:hidden" aria-label="Abrir menú"><Menu size={21} /></button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ADEBB3]"><GraduationCap size={23} /></div>
            <div>
              <p className="text-[15px] font-bold tracking-tight">Verano<span className="font-normal">Admin</span></p>
              <p className="text-[11px] text-[#897e7f]">Panel de administración</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-[#f5f8f5] px-3 py-2 text-xs text-[#766a6b] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#65bd73]" /> Ciclo de verano 2026
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3D2D2E] text-xs font-semibold text-white">EBV</div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {mobileNav && <button className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Cerrar menú" />}
        <aside className={`${mobileNav ? "translate-x-0" : "-translate-x-full"} fixed bottom-0 left-0 top-[76px] z-30 flex w-[250px] flex-col border-r border-[#e8eee8] bg-white p-5 transition-all duration-300 lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] lg:translate-x-0 ${sidebarCollapsed ? "lg:w-0 lg:overflow-visible lg:border-r-0 lg:p-0" : "lg:w-[250px]"}`}>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="absolute right-4 top-[5px] z-40 hidden h-11 w-11 items-center justify-center rounded-xl bg-[#3D2D2E]/80 text-white shadow-sm transition-transform duration-300 hover:bg-[#594345]/80 lg:flex"
              aria-label="Cerrar menú lateral"
              aria-expanded="true"
            >
              <ChevronRight size={24} />
            </button>
          )}
          {(!sidebarCollapsed || mobileNav) && (
            <>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#a19898]">Espacio de trabajo</p>
              <button className="flex items-center gap-3 rounded-xl bg-[#ADEBB3]/45 px-3 py-3 text-left text-sm font-semibold text-[#3D2D2E]">
                <LayoutDashboard size={18} /> Inscripciones
                <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px]">{students.length}</span>
              </button>
              <div className="mt-auto rounded-2xl bg-[#f6f8f6] p-4">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white"><BookOpen size={18} /></div>
                <p className="text-sm font-semibold">Escuela de verano</p>
                <p className="mt-1 text-xs leading-5 text-[#8b8080]">Administra las inscripciones y lleva el control de los talleres.</p>
              </div>
            </>
          )}
        </aside>
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-4 top-[81px] z-40 hidden h-11 w-11 items-center justify-center rounded-xl bg-[#3D2D2E]/80 text-white shadow-sm transition-transform duration-300 hover:bg-[#594345]/80 lg:flex"
            aria-label="Abrir menú lateral"
            aria-expanded="false"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>
        )}

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-medium text-[#8d8182]"><CalendarDays size={14} /> ESCUELA DE VERANO / 2026</p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">Inscripciones</h1>
                <p className="mt-2 text-sm text-[#8b8080]">Gestiona los niños inscritos y el estado de sus pagos.</p>
              </div>
              <button onClick={openCreate} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3D2D2E] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#594345]">
                <Plus size={17} /> Nueva inscripción
              </button>
            </div>

            <div className="mb-7 grid gap-4 sm:grid-cols-3">
              <StatCard label="Total de inscritos" value={students.length} icon={<Users size={18} />} detail="Niños registrados" />
              <StatCard label="Inscripciones pagadas" value={paidCount} icon={<CheckCircle2 size={18} />} detail="Pago confirmado" />
              <StatCard label="Pagos pendientes" value={unpaidCount} icon={<Clock3 size={18} />} detail="Requieren seguimiento" />
            </div>

            <section className="overflow-visible rounded-2xl border border-[#e9eee9] bg-white shadow-[0_4px_24px_rgba(45,65,45,0.035)]">
              <div className="flex flex-col gap-4 border-b border-[#edf0ed] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-bold">Lista de niños</h2>
                  <p className="mt-1 text-xs text-[#94898a]">{filtered.length} {filtered.length === 1 ? "registro encontrado" : "registros encontrados"}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9091]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar niño o encargado..." className="h-10 w-full rounded-xl border border-[#e8ece8] bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-[#aaa1a1] focus:border-[#83d58e] sm:w-[230px]" />
                  </div>
                  <div className="relative">
                    <Filter size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9091]" />
                    <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-[#e8ece8] bg-white pl-9 pr-8 text-xs outline-none focus:border-[#83d58e] sm:w-[155px]">
                      <option value="all">Todos los pagos</option><option value="paid">Pagado</option><option value="unpaid">Pendiente</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#fafcfa] text-[10px] uppercase tracking-[.12em] text-[#9a9090]">
                      <th className="px-6 py-4 font-semibold">Nombre del niño</th>
                      <th className="px-5 py-4 font-semibold">Padre / encargado</th>
                      <th className="px-5 py-4 font-semibold">Estado de pago</th>
                      <th className="px-5 py-4 font-semibold">Taller asignado</th>
                      <th className="w-[70px] px-5 py-4 text-center font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f0]">
                    {visibleStudents.map((student) => (
                      <tr key={student.id} className="group transition hover:bg-[#fbfdfb]">
                        <td className="px-6 py-[17px]">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ADEBB3]/45 text-xs font-bold text-[#3D2D2E]">{student.childName.split(" ").map((part) => part[0]).slice(0,2).join("").toUpperCase()}</div>
                            <span className="text-[13px] font-semibold">{student.childName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-[17px] text-[13px] text-[#776d6e]">{student.parentName}</td>
                        <td className="px-5 py-[17px]">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${student.paid ? "bg-[#e9f8eb] text-[#398247]" : "bg-[#fff4e5] text-[#a66b1e]"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${student.paid ? "bg-[#59b66a]" : "bg-[#e6a13d]"}`} />{student.paid ? "Pagado" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-5 py-[17px]"><span className="rounded-lg bg-[#f5f7f5] px-2.5 py-1.5 text-[11px] font-medium text-[#665b5c]">{student.workshop}</span></td>
                        <td className="relative px-5 py-[17px] text-center">
                          <button onClick={() => setActiveMenu(activeMenu === student.id ? null : student.id)} className="rounded-lg p-2 text-[#8e8384] transition hover:bg-[#f0f5f0] hover:text-[#3D2D2E]" aria-label={`Acciones para ${student.childName}`}><MoreHorizontal size={19} /></button>
                          {activeMenu === student.id && (
                            <div ref={menuRef} className="absolute right-8 top-[52px] z-20 w-36 rounded-xl border border-[#e9ece9] bg-white p-1.5 text-left shadow-[0_10px_35px_rgba(30,30,30,.13)]">
                              <button onClick={() => openEdit(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs hover:bg-[#f4f8f4]"><Pencil size={14} /> Editar</button>
                              <button onClick={() => deleteStudent(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-[#c34d4d] hover:bg-[#fff3f3]"><Trash2 size={14} /> Eliminar</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {visibleStudents.length === 0 && <tr><td colSpan={5} className="px-6 py-16 text-center"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f7f3]"><Search size={19} className="text-[#8d9b8e]" /></div><p className="text-sm font-semibold">No se encontraron registros</p><p className="mt-1 text-xs text-[#9a9090]">Prueba con otro nombre o cambia el filtro.</p></td></tr>}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#edf0ed] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-[#94898a]">Mostrando <span className="font-semibold text-[#3D2D2E]">{filtered.length ? (page - 1) * 10 + 1 : 0}-{Math.min(page * 10, filtered.length)}</span> de <span className="font-semibold text-[#3D2D2E]">{filtered.length}</span> registros</p>
                <div className="flex items-center gap-1.5">
                  <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8ece8] text-[#756a6b] hover:bg-[#f5f8f5] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Página anterior"><ChevronLeft size={16} /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => <button key={number} onClick={() => setPage(number)} className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold ${page === number ? "bg-[#ADEBB3] text-[#3D2D2E]" : "text-[#827778] hover:bg-[#f2f6f2]"}`}>{number}</button>)}
                  <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8ece8] text-[#756a6b] hover:bg-[#f5f8f5] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Página siguiente"><ChevronRight size={16} /></button>
                </div>
              </div>
            </section>
            <p className="mt-5 text-center text-[11px] text-[#aaa1a1]">Los cambios se guardan automáticamente en este navegador.</p>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#21191a]/40 p-4 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="w-full max-w-[470px] rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#ADEBB3]/50"><Users size={18} /></div><h2 className="text-xl font-bold">{editing ? "Editar inscripción" : "Nueva inscripción"}</h2><p className="mt-1 text-xs text-[#918687]">{editing ? "Actualiza los datos del registro." : "Completa los datos para registrar a un niño."}</p></div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-[#8e8384] hover:bg-[#f4f6f4]" aria-label="Cerrar"><X size={18} /></button>
            </div>
            <form onSubmit={saveStudent} className="space-y-4">
              <Field label="Nombre del niño"><input required autoFocus value={form.childName} onChange={(e) => setForm({ ...form, childName: e.target.value })} placeholder="Ej. Sofía Martínez" className="form-input" /></Field>
              <Field label="Nombre del padre / encargado"><input required value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Ej. Carlos Martínez" className="form-input" /></Field>
              <Field label="Taller asignado"><select value={form.workshop} onChange={(e) => setForm({ ...form, workshop: e.target.value })} className="form-input">{WORKSHOPS.map((workshop) => <option key={workshop}>{workshop}</option>)}</select></Field>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e9eee9] p-3.5">
                <div><p className="text-sm font-semibold">Inscripción cancelada</p><p className="mt-0.5 text-[11px] text-[#938889]">Indica si el pago ya fue realizado.</p></div>
                <input type="checkbox" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })} className="h-4 w-4 accent-[#68c777]" />
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="h-11 flex-1 rounded-xl border border-[#e7ebe7] text-sm font-semibold hover:bg-[#f7f9f7]">Cancelar</button>
                <button type="submit" className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#3D2D2E] text-sm font-semibold text-white hover:bg-[#594345]"><Check size={16} /> {editing ? "Guardar cambios" : "Crear inscripción"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, detail }: { label: string; value: number; icon: React.ReactNode; detail: string }) {
  return <div className="rounded-2xl border border-[#e9eee9] bg-white p-5 shadow-[0_4px_24px_rgba(45,65,45,0.025)]"><div className="flex items-center justify-between"><p className="text-xs font-medium text-[#8d8283]">{label}</p><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40">{icon}</div></div><div className="mt-3 flex items-end gap-2"><span className="text-[28px] font-bold leading-none tracking-tight">{value}</span><span className="pb-0.5 text-[11px] text-[#9b9091]">{detail}</span></div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold">{label}</span>{children}</label>;
}
