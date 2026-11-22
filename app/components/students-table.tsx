"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Filter, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { isPaymentComplete } from "../lib/students";
import type { Student } from "../types/student";

type StudentsTableProps = {
  students: Student[];
  filteredCount: number;
  search: string;
  paymentFilter: string;
  expandedStudentId: string | null;
  onSearchChange: (value: string) => void;
  onPaymentFilterChange: (value: string) => void;
  onToggleExpanded: (studentId: string) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
};

export default function StudentsTable({
  students,
  filteredCount,
  search,
  paymentFilter,
  expandedStudentId,
  onSearchChange,
  onPaymentFilterChange,
  onToggleExpanded,
  onEdit,
  onDelete
}: StudentsTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setActiveMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-[#edf0ed] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-bold">Lista de niños</h2>
          <p className="mt-1 text-xs text-[#94898a]">{filteredCount} {filteredCount === 1 ? "registro encontrado" : "registros encontrados"}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9091]" />
            <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar alumno..." className="h-10 w-full rounded-xl border border-[#e8ece8] bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-[#aaa1a1] focus:border-[#83d58e] sm:w-[230px]" />
          </div>
          <div className="relative">
            <Filter size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9091]" />
            <select value={paymentFilter} onChange={(event) => onPaymentFilterChange(event.target.value)} className="h-10 w-full appearance-none rounded-xl border border-[#e8ece8] bg-white pl-9 pr-8 text-xs outline-none focus:border-[#83d58e] sm:w-[155px]">
              <option value="all">Todos los pagos</option><option value="paid">Pagado</option><option value="unpaid">Pendiente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto py-3">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="whitespace-nowrap bg-[#e6ebe6] text-[11px] font-extrabold uppercase tracking-[.12em] text-[#554445]">
              <th className="px-6 py-4 font-extrabold">Nombre del alumno</th>
              <th className="px-5 py-4 font-extrabold">Edad</th>
              <th className="px-5 py-4 font-extrabold">Ubicación</th>
              <th className="px-5 py-4 font-extrabold">Taller</th>
              <th className="px-5 py-4 font-extrabold">Estado de pago</th>
              <th className="w-[48px] px-2 py-4" aria-label="Más información" />
              <th className="w-[70px] px-5 py-4 text-center font-extrabold">Acciones</th>
            </tr>
          </thead>
          {students.map((student, index) => (
            <tbody
              key={student.id}
              className={`border-b border-[#dfe5df] transition-shadow duration-200 ease-out ${expandedStudentId === student.id ? "relative z-10 shadow-[0_0_16px_2px_rgba(45,65,45,0.2)]" : ""}`}
            >
              <tr className={`transition-colors duration-200 ${index % 2 === 0 ? "bg-white hover:bg-[#fafcfa]" : "bg-[#f3f6f3] hover:bg-[#edf2ed]"}`}>
                <td className="whitespace-nowrap px-6 py-[17px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ADEBB3]/45 text-xs font-bold text-[#3D2D2E]">{student.childName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</div>
                    <span className="text-[13px] font-semibold">{student.childName}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-[17px] text-sm text-[#776d6e]">{student.age || "—"}</td>
                <td className="whitespace-nowrap px-5 py-[17px] text-sm text-[#776d6e]">{student.location}</td>
                <td className="whitespace-nowrap px-5 py-[17px]"><span className="rounded-lg bg-[#f5f7f5] px-2.5 py-1.5 text-xs font-medium text-[#665b5c]">{student.workshop}</span></td>
                <td className="whitespace-nowrap px-5 py-[17px]">
                  <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm font-bold ${isPaymentComplete(student.amountPaid) ? "bg-[#e9f8eb] text-[#398247]" : "bg-[#fff4e5] text-[#a66b1e]"}`}>
                    ${student.amountPaid || "0.00"}
                  </span>
                </td>
                <td className="px-2 py-[17px] text-center">
                  <button
                    onClick={() => onToggleExpanded(student.id)}
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
                      <button onClick={() => { setActiveMenu(null); onEdit(student); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs hover:bg-[#e5efe5]"><Pencil size={14} /> Editar</button>
                      <button onClick={() => { setActiveMenu(null); onDelete(student); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-[#c34d4d] hover:bg-[#ffdddd]"><Trash2 size={14} /> Eliminar</button>
                    </div>
                  )}
                </td>
              </tr>
              {expandedStudentId === student.id && (
                <tr className={index % 2 === 0 ? "bg-white" : "bg-[#f3f6f3]"}>
                  <td colSpan={7} className="border-t border-[#dfe5df] px-6 py-4">
                    <div className={`grid grid-cols-5 gap-4 rounded-xl px-3 py-2 ${index % 2 === 0 ? "bg-white" : "bg-[#f3f6f3]"}`}>
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
          {students.length === 0 && (
            <tbody>
              <tr><td colSpan={7} className="px-6 py-16 text-center"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f7f3]"><Search size={19} className="text-[#8d9b8e]" /></div><p className="text-sm font-semibold">No se encontraron registros</p><p className="mt-1 text-xs text-[#9a9090]">Prueba con otro nombre o cambia el filtro.</p></td></tr>
            </tbody>
          )}
        </table>
      </div>
    </>
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
