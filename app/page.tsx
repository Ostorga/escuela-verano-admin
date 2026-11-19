"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Plus, MoreHorizontal, Pencil, Trash2, Users, LayoutDashboard,
  ChevronLeft, ChevronRight, ChevronDown, X, Check, GraduationCap, Menu, Filter,
  CalendarDays, BookOpen, CircleDollarSign, Shirt
} from "lucide-react";

type Student = {
  id: number;
  childName: string;
  age: number;
  location: string;
  guardianName: string;
  enrolledBy: string;
  shirtSize: string;
  phoneNumber: string;
  multimediaAuthorized: boolean;
  amountPaid: string;
  workshop: string;
};

const STORAGE_KEY = "summer-school-students-v1";
const WORKSHOPS = ["Arte", "Cocina", "Costura", "Boy Scout"];
const PAYMENT_THRESHOLD = 3.5;

function isPaymentComplete(amountPaid: string) {
  return getPaymentAmount(amountPaid) >= PAYMENT_THRESHOLD;
}

function getPaymentAmount(amountPaid: string) {
  const amount = Number(amountPaid.replace(",", "."));
  return Number.isFinite(amount) ? amount : 0;
}

function formatAmount(amountPaid: string) {
  const cleaned = amountPaid.replace(/[^0-9.,]/g, "");
  const separatorIndex = Math.max(cleaned.lastIndexOf("."), cleaned.lastIndexOf(","));
  if (separatorIndex >= 0) {
    const whole = cleaned.slice(0, separatorIndex).replace(/\D/g, "") || "0";
    const decimals = cleaned.slice(separatorIndex + 1).replace(/\D/g, "").slice(0, 2).padEnd(2, "0");
    return `${whole}.${decimals}`;
  }
  const digits = cleaned.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (!digits) return "";
  return `${digits.slice(0, -2) || "0"}.${digits.slice(-2).padStart(2, "0")}`;
}

function capitalizeWords(value: string) {
  return value.replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

const initialStudents: Student[] = [
  { id: 1, childName: "Sofía Martínez", age: 8, location: "Centro", guardianName: "Carlos Martínez", enrolledBy: "Laura Pérez", shirtSize: "5-M", phoneNumber: "555-0101", multimediaAuthorized: true, amountPaid: "50", workshop: "Arte" },
  { id: 2, childName: "Mateo Hernández", age: 9, location: "Norte", guardianName: "Ana Hernández", enrolledBy: "Laura Pérez", shirtSize: "10-S", phoneNumber: "555-0102", multimediaAuthorized: true, amountPaid: "50", workshop: "Boy Scout" },
  { id: 3, childName: "Valentina López", age: 7, location: "Sur", guardianName: "José López", enrolledBy: "Marta Ruiz", shirtSize: "5-M", phoneNumber: "555-0103", multimediaAuthorized: false, amountPaid: "0", workshop: "Cocina" },
  { id: 4, childName: "Sebastián Rivera", age: 10, location: "Centro", guardianName: "María Rivera", enrolledBy: "Laura Pérez", shirtSize: "10-S", phoneNumber: "555-0104", multimediaAuthorized: true, amountPaid: "50", workshop: "Costura" },
  { id: 5, childName: "Isabella Flores", age: 8, location: "Este", guardianName: "Pedro Flores", enrolledBy: "Marta Ruiz", shirtSize: "5-M", phoneNumber: "555-0105", multimediaAuthorized: false, amountPaid: "0", workshop: "Cocina" },
  { id: 6, childName: "Diego Ramírez", age: 11, location: "Norte", guardianName: "Laura Ramírez", enrolledBy: "Laura Pérez", shirtSize: "10-S", phoneNumber: "555-0106", multimediaAuthorized: true, amountPaid: "50", workshop: "Boy Scout" },
  { id: 7, childName: "Camila Torres", age: 9, location: "Sur", guardianName: "Ricardo Torres", enrolledBy: "Marta Ruiz", shirtSize: "5-M", phoneNumber: "555-0107", multimediaAuthorized: true, amountPaid: "50", workshop: "Costura" },
  { id: 8, childName: "Daniel García", age: 7, location: "Oeste", guardianName: "Patricia García", enrolledBy: "Laura Pérez", shirtSize: "5-M", phoneNumber: "555-0108", multimediaAuthorized: false, amountPaid: "0", workshop: "Arte" },
  { id: 9, childName: "Luciana Cruz", age: 10, location: "Centro", guardianName: "Miguel Cruz", enrolledBy: "Marta Ruiz", shirtSize: "10-S", phoneNumber: "555-0109", multimediaAuthorized: true, amountPaid: "50", workshop: "Cocina" },
  { id: 10, childName: "Gabriel Reyes", age: 8, location: "Este", guardianName: "Elena Reyes", enrolledBy: "Laura Pérez", shirtSize: "5-M", phoneNumber: "555-0110", multimediaAuthorized: true, amountPaid: "50", workshop: "Costura" },
  { id: 11, childName: "Emma Aguilar", age: 6, location: "Norte", guardianName: "Francisco Aguilar", enrolledBy: "Marta Ruiz", shirtSize: "10-S", phoneNumber: "555-0111", multimediaAuthorized: false, amountPaid: "0", workshop: "Arte" },
  { id: 12, childName: "Nicolás Castro", age: 9, location: "Sur", guardianName: "Verónica Castro", enrolledBy: "Laura Pérez", shirtSize: "5-M", phoneNumber: "555-0112", multimediaAuthorized: true, amountPaid: "50", workshop: "Boy Scout" }
];

export default function Home() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState({
    childName: "",
    age: "",
    location: "",
    guardianName: "",
    enrolledBy: "",
    shirtSize: "",
    phoneNumber: "",
    multimediaAuthorized: false,
    amountPaid: "",
    workshop: WORKSHOPS[0]
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedStudents = JSON.parse(saved) as Partial<Student>[];
        setStudents(savedStudents.map((student) => ({
          id: student.id ?? Date.now(),
          childName: student.childName ?? "",
          age: student.age ?? 0,
          location: student.location ?? "Sin especificar",
          guardianName: student.guardianName ?? "Sin especificar",
          enrolledBy: student.enrolledBy ?? "Sin especificar",
          shirtSize: student.shirtSize ?? "Sin especificar",
          phoneNumber: (student.phoneNumber ?? "").replace(/\D/g, "").slice(0, 8),
          multimediaAuthorized: student.multimediaAuthorized ?? false,
          amountPaid: student.amountPaid ?? "0",
          workshop: WORKSHOPS.includes(student.workshop ?? "") ? student.workshop! : WORKSHOPS[0]
        })));
      }
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
    const matchesSearch = student.childName.toLowerCase().includes(term);
    const matchesPayment = paymentFilter === "all" || (paymentFilter === "paid" ? isPaymentComplete(student.amountPaid) : !isPaymentComplete(student.amountPaid));
    return matchesSearch && matchesPayment;
  }), [students, search, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const visibleStudents = filtered.slice((page - 1) * 10, page * 10);
  const paidCount = students.filter((student) => isPaymentComplete(student.amountPaid)).length;
  const partialPaymentCount = students.filter((student) => {
    const amount = getPaymentAmount(student.amountPaid);
    return amount > 0 && amount < PAYMENT_THRESHOLD;
  }).length;
  const noPaymentCount = students.filter((student) => getPaymentAmount(student.amountPaid) <= 0).length;
  const shirtSizeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    students.forEach((student) => {
      const size = student.shirtSize.trim() || "Sin especificar";
      counts.set(size, (counts.get(size) ?? 0) + 1);
    });
    return Array.from(counts, ([size, count]) => ({ size, count }))
      .sort((a, b) => a.size.localeCompare(b.size, "es", { numeric: true }));
  }, [students]);
  const workshopCounts = WORKSHOPS.map((workshop) => ({
    workshop,
    count: students.filter((student) => student.workshop === workshop).length
  }));

  useEffect(() => { setPage(1); }, [search, paymentFilter]);

  function openCreate() {
    setEditing(null);
    setForm({
      childName: "",
      age: "",
      location: "",
      guardianName: "",
      enrolledBy: "",
      shirtSize: "",
      phoneNumber: "",
      multimediaAuthorized: false,
      amountPaid: "",
      workshop: WORKSHOPS[0]
    });
    setModalOpen(true);
  }

  function openEdit(student: Student) {
    setEditing(student);
    setForm({
      childName: student.childName,
      age: String(student.age),
      location: student.location,
      guardianName: student.guardianName,
      enrolledBy: student.enrolledBy,
      shirtSize: student.shirtSize,
      phoneNumber: student.phoneNumber.replace(/\D/g, "").slice(0, 8),
      multimediaAuthorized: student.multimediaAuthorized,
      amountPaid: student.amountPaid
        ? /[.,]/.test(student.amountPaid) ? student.amountPaid.replace(",", ".") : `${student.amountPaid}.00`
        : "",
      workshop: student.workshop
    });
    setActiveMenu(null);
    setModalOpen(true);
  }

  function saveStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const childName = form.childName.trim();
    const location = form.location.trim();
    const guardianName = form.guardianName.trim();
    const enrolledBy = form.enrolledBy.trim();
    const shirtSize = form.shirtSize.trim();
    const phoneNumber = form.phoneNumber.replace(/\D/g, "").slice(0, 8);
    if (!childName || !location || !guardianName || !enrolledBy || !shirtSize || !phoneNumber || form.age === "") return;
    const studentData = { ...form, childName, age: Number(form.age), location, guardianName, enrolledBy, shirtSize, phoneNumber, amountPaid: formatAmount(form.amountPaid) };
    if (editing) {
      setStudents((current) => current.map((student) => student.id === editing.id ? { ...student, ...studentData } : student));
    } else {
      setStudents((current) => [{ ...studentData, id: Date.now() }, ...current]);
      setPage(1);
    }
    setModalOpen(false);
  }

  function deleteStudent(student: Student) {
    if (window.confirm(`¿Seguro que deseas eliminar la inscripción de ${student.childName}?`)) {
      setStudents((current) => current.filter((item) => item.id !== student.id));
      setActiveMenu(null);
      setExpandedStudentId((current) => current === student.id ? null : current);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#3D2D2E]/10 bg-[#3D2D2E]/50 text-[#3D2D2E] backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(!mobileNav)} className="rounded-lg p-2 hover:bg-[#e3eee3] lg:hidden" aria-label="Abrir menú"><Menu size={21} /></button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ADEBB3]"><GraduationCap size={23} /></div>
            <div>
              <p className="text-[18px] font-bold tracking-tight">Verano<span className="font-normal">Admin</span></p>
              <p className="text-[13px] text-[#4c3b3c]">Panel de administración</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white/35 px-3 py-2 text-xs text-[#3D2D2E] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#65bd73]" /> Ciclo de verano 2026
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#3D2D2E]/80 text-xs font-semibold text-white">EBV</div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {mobileNav && <button className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Cerrar menú" />}
        <aside className={`${mobileNav ? "translate-x-0" : "-translate-x-full"} fixed bottom-0 left-0 top-[76px] z-30 flex w-[250px] flex-col border-r border-[#e8eee8] bg-white p-5 transition-all duration-300 ease-in-out lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] lg:translate-x-0 ${sidebarCollapsed ? "lg:w-0 lg:overflow-visible lg:border-r-0 lg:p-0" : "lg:w-[250px]"}`}>
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
        <button
          onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          style={{ left: sidebarCollapsed ? 16 : 190 }}
          className="fixed top-[81px] z-40 hidden h-11 w-11 items-center justify-center rounded-xl bg-[#3D2D2E]/80 text-white shadow-sm transition-[left,background-color] duration-300 ease-in-out hover:bg-[#261a1b]/90 lg:flex"
          aria-label={sidebarCollapsed ? "Abrir menú lateral" : "Cerrar menú lateral"}
          aria-expanded={!sidebarCollapsed}
        >
          <ChevronRight size={24} className={`transition-transform duration-300 ease-in-out ${sidebarCollapsed ? "rotate-180" : ""}`} />
        </button>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-medium text-[#8d8182]"><CalendarDays size={14} /> ESCUELA DE VERANO / 2026</p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">Inscripciones</h1>
                <p className="mt-2 text-sm text-[#8b8080]">Gestiona los niños inscritos y el estado de sus pagos.</p>
              </div>
              <button onClick={openCreate} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3D2D2E] px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(61,45,46,0.22)] transition hover:bg-[#261a1b]">
                <Plus size={17} /> Nueva inscripción
              </button>
            </div>

            <div className="mx-auto mb-7 grid max-w-[920px] gap-4 sm:grid-cols-2">
              <StatCard label="Total de inscritos" value={students.length} icon={<Users size={18} />} detail="Niños registrados" />
              <PaymentSummaryCard paid={paidCount} partial={partialPaymentCount} none={noPaymentCount} />
              <ShirtSummaryCard sizes={shirtSizeCounts} />
              <WorkshopSummaryCard workshops={workshopCounts} />
            </div>

            <section className="overflow-visible rounded-2xl border border-[#dfe5df] bg-white shadow-[0_8px_30px_rgba(45,65,45,0.09)]">
              <div className="flex flex-col gap-4 border-b border-[#edf0ed] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-bold">Lista de niños</h2>
                  <p className="mt-1 text-xs text-[#94898a]">{filtered.length} {filtered.length === 1 ? "registro encontrado" : "registros encontrados"}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9091]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar alumno..." className="h-10 w-full rounded-xl border border-[#e8ece8] bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-[#aaa1a1] focus:border-[#83d58e] sm:w-[230px]" />
                  </div>
                  <div className="relative">
                    <Filter size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9091]" />
                    <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-[#e8ece8] bg-white pl-9 pr-8 text-xs outline-none focus:border-[#83d58e] sm:w-[155px]">
                      <option value="all">Todos los pagos</option><option value="paid">Pagado</option><option value="unpaid">Pendiente</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto py-3 2xl:overflow-visible">
                <table className="w-full min-w-[1020px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#e6ebe6] text-[11px] font-extrabold uppercase tracking-[.12em] text-[#554445]">
                      <th className="px-6 py-4 font-extrabold">Nombre del alumno</th>
                      <th className="px-5 py-4 font-extrabold">Edad</th>
                      <th className="px-5 py-4 font-extrabold">Ubicación</th>
                      <th className="px-5 py-4 font-extrabold">Taller</th>
                      <th className="px-5 py-4 font-extrabold">Estado de pago</th>
                      <th className="w-[48px] px-2 py-4" aria-label="Más información" />
                      <th className="w-[70px] px-5 py-4 text-center font-extrabold">Acciones</th>
                    </tr>
                  </thead>
                  {visibleStudents.map((student, index) => (
                    <tbody
                      key={student.id}
                      className={`border-b border-[#dfe5df] transition-all duration-200 ease-out ${expandedStudentId === student.id ? "relative z-10 scale-[1.015] shadow-[0_0_16px_2px_rgba(45,65,45,0.2)]" : ""}`}
                    >
                      <tr className={`transition-colors duration-200 ${index % 2 === 0 ? "bg-white hover:bg-[#fafcfa]" : "bg-[#f3f6f3] hover:bg-[#edf2ed]"}`}>
                        <td className="px-6 py-[17px]">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ADEBB3]/45 text-xs font-bold text-[#3D2D2E]">{student.childName.split(" ").map((part) => part[0]).slice(0,2).join("").toUpperCase()}</div>
                            <span className="text-[13px] font-semibold">{student.childName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-[17px] text-sm text-[#776d6e]">{student.age || "—"}</td>
                        <td className="px-5 py-[17px] text-sm text-[#776d6e]">{student.location}</td>
                        <td className="px-5 py-[17px]"><span className="rounded-lg bg-[#f5f7f5] px-2.5 py-1.5 text-xs font-medium text-[#665b5c]">{student.workshop}</span></td>
                        <td className="px-5 py-[17px]">
                          <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm font-bold ${isPaymentComplete(student.amountPaid) ? "bg-[#e9f8eb] text-[#398247]" : "bg-[#fff4e5] text-[#a66b1e]"}`}>
                            ${student.amountPaid || "0.00"}
                          </span>
                        </td>
                        <td className="px-2 py-[17px] text-center">
                          <button
                            onClick={() => setExpandedStudentId((current) => current === student.id ? null : student.id)}
                            className="rounded-lg p-2.5 text-[#3D2D2E] transition hover:bg-[#e1ebe1]"
                            aria-label={`${expandedStudentId === student.id ? "Ocultar" : "Mostrar"} más información de ${student.childName}`}
                            aria-expanded={expandedStudentId === student.id}
                          >
                            <ChevronDown size={21} strokeWidth={2.5} className={`transition-transform ${expandedStudentId === student.id ? "rotate-180" : ""}`} />
                          </button>
                        </td>
                        <td className="relative px-5 py-[17px] text-center">
                          <button onClick={() => setActiveMenu(activeMenu === student.id ? null : student.id)} className="rounded-lg p-2 text-[#8e8384] transition hover:bg-[#e1ebe1] hover:text-[#3D2D2E]" aria-label={`Acciones para ${student.childName}`}><MoreHorizontal size={19} /></button>
                          {activeMenu === student.id && (
                            <div ref={menuRef} className="absolute right-8 top-[52px] z-20 w-36 rounded-xl border border-[#e9ece9] bg-white p-1.5 text-left shadow-[0_10px_35px_rgba(30,30,30,.13)]">
                              <button onClick={() => openEdit(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs hover:bg-[#e5efe5]"><Pencil size={14} /> Editar</button>
                              <button onClick={() => deleteStudent(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-[#c34d4d] hover:bg-[#ffdddd]"><Trash2 size={14} /> Eliminar</button>
                            </div>
                          )}
                        </td>
                      </tr>
                      {expandedStudentId === student.id && (
                        <tr className={index % 2 === 0 ? "bg-white" : "bg-[#f3f6f3]"}>
                          <td colSpan={7} className="border-t border-[#dfe5df] px-6 py-4">
                            <div className={`grid gap-4 rounded-xl px-3 py-2 sm:grid-cols-2 lg:grid-cols-4 ${index % 2 === 0 ? "bg-white" : "bg-[#f3f6f3]"}`}>
                              <DetailItem label="Encargado" value={student.guardianName} />
                              <DetailItem label="Inscrito por" value={student.enrolledBy} />
                              <DetailItem label="Talla" value={student.shirtSize} />
                              <DetailItem label="Número telefónico" value={student.phoneNumber || "Sin especificar"} />
                              <DetailItem label="Autorización de multimedia" value={student.multimediaAuthorized ? "Autorizada" : "No autorizada"} authorized={student.multimediaAuthorized} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  ))}
                  {visibleStudents.length === 0 && (
                    <tbody>
                      <tr><td colSpan={7} className="px-6 py-16 text-center"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f7f3]"><Search size={19} className="text-[#8d9b8e]" /></div><p className="text-sm font-semibold">No se encontraron registros</p><p className="mt-1 text-xs text-[#9a9090]">Prueba con otro nombre o cambia el filtro.</p></td></tr>
                    </tbody>
                  )}
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#edf0ed] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-[#94898a]">Mostrando <span className="font-semibold text-[#3D2D2E]">{filtered.length ? (page - 1) * 10 + 1 : 0}-{Math.min(page * 10, filtered.length)}</span> de <span className="font-semibold text-[#3D2D2E]">{filtered.length}</span> registros</p>
                <div className="flex items-center gap-1.5">
                  <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8ece8] text-[#756a6b] hover:bg-[#e4eee4] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Página anterior"><ChevronLeft size={16} /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => <button key={number} onClick={() => setPage(number)} className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold ${page === number ? "bg-[#ADEBB3] text-[#3D2D2E]" : "text-[#827778] hover:bg-[#e2ece2]"}`}>{number}</button>)}
                  <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8ece8] text-[#756a6b] hover:bg-[#e4eee4] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Página siguiente"><ChevronRight size={16} /></button>
                </div>
              </div>
            </section>
            <p className="mt-5 text-center text-[11px] text-[#aaa1a1]">Los cambios se guardan automáticamente en este navegador.</p>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#21191a]/40 p-4 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-[540px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#ADEBB3]/50"><Users size={18} /></div><h2 className="text-xl font-bold">{editing ? "Editar inscripción" : "Nueva inscripción"}</h2><p className="mt-1 text-xs text-[#918687]">{editing ? "Actualiza los datos del registro." : "Completa los datos para registrar a un niño."}</p></div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-[#8e8384] hover:bg-[#e6ece6]" aria-label="Cerrar"><X size={18} /></button>
            </div>
            <form onSubmit={saveStudent} className="space-y-4">
              <Field label="Nombre del alumno"><input required autoFocus value={form.childName} onChange={(e) => setForm({ ...form, childName: capitalizeWords(e.target.value) })} placeholder="Ej. Sofía Martínez" className="form-input" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Encargado"><input required value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: capitalizeWords(e.target.value) })} placeholder="Ej. Carlos Martínez" className="form-input" /></Field>
                <Field label="Nombre de quien inscribió"><input required value={form.enrolledBy} onChange={(e) => setForm({ ...form, enrolledBy: capitalizeWords(e.target.value) })} placeholder="Ej. Laura Pérez" className="form-input" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Edad"><input required inputMode="numeric" pattern="[0-9]*" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "") })} placeholder="Ej. 8" className="form-input" /></Field>
                <Field label="Ubicación"><input required value={form.location} onChange={(e) => setForm({ ...form, location: capitalizeWords(e.target.value) })} placeholder="Ej. Centro" className="form-input" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Talla"><input required value={form.shirtSize} onChange={(e) => setForm({ ...form, shirtSize: e.target.value.toUpperCase() })} placeholder="Ej. 5-M" className="form-input" /></Field>
                <Field label="Número telefónico"><input required type="tel" inputMode="numeric" maxLength={8} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 8) })} placeholder="Ej. 55501010" className="form-input" /></Field>
              </div>
              <div>
                <span className="mb-1.5 block text-xs font-semibold">Taller</span>
                <WorkshopSelect value={form.workshop} onChange={(workshop) => setForm({ ...form, workshop })} />
              </div>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e9eee9] p-3.5">
                <span className="text-sm font-semibold">Autorización de multimedia</span>
                <input type="checkbox" checked={form.multimediaAuthorized} onChange={(e) => setForm({ ...form, multimediaAuthorized: e.target.checked })} className="h-4 w-4 accent-[#68c777]" />
              </label>
              <Field label="Cantidad abonada">
                <div className="flex h-[42px] items-center rounded-[10px] border border-[#e8ece8] bg-white transition focus-within:border-[#83d58e]">
                  <span className="pl-3 text-[13px] text-[#3D2D2E]">$</span>
                  <input
                    inputMode="decimal"
                    value={form.amountPaid}
                    onChange={(e) => setForm({ ...form, amountPaid: e.target.value.replace(/[^0-9.,]/g, "") })}
                    onBlur={(e) => setForm({ ...form, amountPaid: formatAmount(e.target.value) })}
                    placeholder="0.00"
                    aria-label="Cantidad abonada en dólares"
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-[13px] text-[#3D2D2E] outline-none"
                  />
                </div>
              </Field>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="h-11 flex-1 rounded-xl border border-[#e7ebe7] text-sm font-semibold hover:bg-[#e7efe7]">Cancelar</button>
                <button type="submit" className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#3D2D2E] text-sm font-semibold text-white hover:bg-[#261a1b]"><Check size={16} /> {editing ? "Guardar cambios" : "Crear inscripción"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, detail }: { label: string; value: number; icon: React.ReactNode; detail: string }) {
  return <div className="min-h-[150px] rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_8px_24px_rgba(45,65,45,0.08)]"><div className="flex items-center justify-between"><p className="text-xs font-medium text-[#8d8283]">{label}</p><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40">{icon}</div></div><div className="mt-3 flex items-end gap-2"><span className="text-[28px] font-bold leading-none tracking-tight">{value}</span><span className="pb-0.5 text-[11px] text-[#9b9091]">{detail}</span></div></div>;
}

function PaymentSummaryCard({ paid, partial, none }: { paid: number; partial: number; none: number }) {
  return (
    <div className="min-h-[150px] rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_8px_24px_rgba(45,65,45,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8d8283]">Estado de pagos</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40"><CircleDollarSign size={18} /></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <PaymentCount label="Pagado completo" value={paid} />
        <PaymentCount label="Abono parcial" value={partial} />
        <PaymentCount label="Sin pago" value={none} />
      </div>
    </div>
  );
}

function ShirtSummaryCard({ sizes }: { sizes: { size: string; count: number }[] }) {
  return (
    <div className="min-h-[150px] rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_8px_24px_rgba(45,65,45,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8d8283]">Total de tallas</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40"><Shirt size={18} /></div>
      </div>
      <table className="mt-3 w-full text-xs">
        <tbody>
          {sizes.length ? sizes.map(({ size, count }, index) => (
            <tr key={size} className={index ? "border-t border-[#edf0ed]" : ""}>
              <td className="py-1.5 text-[#665b5c]">{size}</td>
              <td className="py-1.5 text-right font-semibold text-[#3D2D2E]">{count}</td>
            </tr>
          )) : <tr><td className="py-1.5 text-xs text-[#9b9091]">Sin tallas registradas</td><td /></tr>}
        </tbody>
      </table>
    </div>
  );
}

function WorkshopSummaryCard({ workshops }: { workshops: { workshop: string; count: number }[] }) {
  return (
    <div className="min-h-[150px] rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_8px_24px_rgba(45,65,45,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8d8283]">Inscripciones por taller</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40"><BookOpen size={18} /></div>
      </div>
      <table className="mt-3 w-full text-xs">
        <tbody>
          {workshops.map(({ workshop, count }, index) => (
            <tr key={workshop} className={index ? "border-t border-[#edf0ed]" : ""}>
              <td className="py-1.5 text-[#665b5c]">{workshop}</td>
              <td className="py-1.5 text-right font-semibold text-[#3D2D2E]">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentCount({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span className="text-[25px] font-bold leading-none tracking-tight">{value}</span>
      <p className="mt-1 text-[10px] leading-4 text-[#9b9091]">{label}</p>
    </div>
  );
}

function DetailItem({ label, value, authorized }: { label: string; value: string; authorized?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94898a]">{label}</p>
      {authorized === undefined ? (
        <p className="mt-1 text-sm font-medium text-[#3D2D2E]">{value}</p>
      ) : (
        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${authorized ? "bg-[#e9f8eb] text-[#398247]" : "bg-[#fff4e5] text-[#a66b1e]"}`}>{value}</span>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold">{label}</span>{children}</label>;
}

function WorkshopSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-[42px] w-full items-center justify-between rounded-[10px] border border-[#e8ece8] bg-white px-3 text-left text-[13px] text-[#3D2D2E] outline-none transition hover:border-[#a5bba7] focus:border-[#83d58e]"
      >
        {value}
        <ChevronDown size={16} className={`text-[#8e8384] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="listbox" aria-label="Talleres disponibles" className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-[#e8ece8] bg-white p-1.5 shadow-[0_10px_30px_rgba(45,65,45,0.12)]">
          {WORKSHOPS.map((workshop) => (
            <button
              key={workshop}
              type="button"
              role="option"
              aria-selected={value === workshop}
              onClick={() => {
                onChange(workshop);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] transition ${value === workshop ? "bg-[#ADEBB3]/40 font-semibold text-[#3D2D2E]" : "text-[#665b5c] hover:bg-[#e4eee4]"}`}
            >
              {workshop}
              {value === workshop && <Check size={15} className="text-[#398247]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
