"use client";

import { useEffect, useRef } from "react";
import { Check, Users, X } from "lucide-react";
import { capitalizeWords, formatAmount, WORKSHOPS } from "../lib/students";
import type { Student, StudentForm } from "../types/student";
import DropdownSelect from "./dropdown-select";

type EnrollmentModalProps = {
  form: StudentForm;
  editing: Student | null;
  onFormChange: (form: StudentForm) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function EnrollmentModal({ form, editing, onFormChange, onSubmit, onClose }: EnrollmentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const focusedFieldRef = useRef<HTMLInputElement | null>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    const handleViewportResize = () => {
      if (!focusedFieldRef.current || !window.matchMedia("(max-width: 639px)").matches) return;
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => {
        keepFocusedFieldVisible(focusedFieldRef.current);
      }, 100);
    };

    visualViewport?.addEventListener("resize", handleViewportResize);
    return () => {
      visualViewport?.removeEventListener("resize", handleViewportResize);
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    };
  }, []);

  function handleFocusCapture(event: React.FocusEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || ["checkbox", "radio", "button", "submit", "reset", "file"].includes(target.type)) return;

    focusedFieldRef.current = target;
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    keepFocusedFieldVisible(target);
    focusTimerRef.current = setTimeout(() => keepFocusedFieldVisible(target), 300);
  }

  function handlePointerDownCapture(event: React.PointerEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('input:not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]')) return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  function keepFocusedFieldVisible(field: HTMLInputElement | null) {
    const modal = modalRef.current;
    if (!field || !modal) return;

    const modalTop = modal.getBoundingClientRect().top;
    const fieldTop = field.getBoundingClientRect().top;
    modal.scrollTo({
      top: modal.scrollTop + fieldTop - modalTop - modal.clientHeight * 0.35,
      behavior: "smooth"
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#21191a]/40 p-4 backdrop-blur-[2px] sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={modalRef} onFocusCapture={handleFocusCapture} onPointerDownCapture={handlePointerDownCapture} className="max-h-[calc(100dvh-2rem)] w-full max-w-[540px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between">
          <div><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#ADEBB3]/50"><Users size={18} /></div><h2 className="text-xl font-bold">{editing ? "Editar inscripción" : "Nueva inscripción"}</h2><p className="mt-1 text-xs text-[#918687]">{editing ? "Actualiza los datos del registro." : "Completa los datos para registrar a un niño."}</p></div>
          <button onClick={onClose} className="rounded-lg p-2 text-[#8e8384] hover:bg-[#e6ece6]" aria-label="Cerrar"><X size={18} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Nombre del alumno"><input required value={form.childName} onChange={(event) => onFormChange({ ...form, childName: capitalizeWords(event.target.value) })} placeholder="Ej. Sofía Martínez" className="form-input" /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Encargado"><input required value={form.guardianName} onChange={(event) => onFormChange({ ...form, guardianName: capitalizeWords(event.target.value) })} placeholder="Ej. Carlos Martínez" className="form-input" /></Field>
            <Field label="Nombre de quien inscribió"><input required value={form.enrolledBy} onChange={(event) => onFormChange({ ...form, enrolledBy: capitalizeWords(event.target.value) })} placeholder="Ej. Laura Pérez" className="form-input" /></Field>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Edad"><input required inputMode="numeric" pattern="[0-9]*" value={form.age} onChange={(event) => onFormChange({ ...form, age: event.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "") })} placeholder="Ej. 8" className="form-input" /></Field>
            <Field label="Ubicación"><input required value={form.location} onChange={(event) => onFormChange({ ...form, location: capitalizeWords(event.target.value) })} placeholder="Ej. Centro" className="form-input" /></Field>
          </div>
          <Field label="Sexo">
            <DropdownSelect
              value={form.gender}
              options={[{ value: "M", label: "M" }, { value: "F", label: "F" }]}
              onChange={(gender) => onFormChange({ ...form, gender: gender === "M" ? "M" : "F" })}
              placeholder="Selecciona M o F"
              ariaLabel="Sexo"
            />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Talla"><input required value={form.shirtSize} onChange={(event) => onFormChange({ ...form, shirtSize: event.target.value.toUpperCase() })} placeholder="Ej. 5-M" className="form-input" /></Field>
            <Field label="Número telefónico"><input required type="tel" inputMode="numeric" maxLength={8} value={form.phoneNumber} onChange={(event) => onFormChange({ ...form, phoneNumber: event.target.value.replace(/\D/g, "").slice(0, 8) })} placeholder="Ej. 55501010" className="form-input" /></Field>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold">Taller</span>
            <DropdownSelect
              value={form.workshop}
              options={WORKSHOPS.map((workshop) => ({ value: workshop, label: workshop }))}
              onChange={(workshop) => onFormChange({ ...form, workshop })}
              ariaLabel="Talleres"
            />
          </div>
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e9eee9] p-3.5">
            <span className="text-sm font-semibold">Autorización de multimedia</span>
            <input type="checkbox" checked={form.multimediaAuthorized} onChange={(event) => onFormChange({ ...form, multimediaAuthorized: event.target.checked })} className="h-4 w-4 accent-[#68c777]" />
          </label>
          <Field label="Cantidad abonada">
            <div className="flex h-[42px] items-center rounded-[10px] border border-[#e8ece8] bg-white transition focus-within:border-[#83d58e]">
              <span className="pl-3 text-[13px] text-[#3D2D2E]">$</span>
              <input
                inputMode="decimal"
                value={form.amountPaid}
                onChange={(event) => onFormChange({ ...form, amountPaid: event.target.value.replace(/[^0-9.,]/g, "") })}
                onBlur={(event) => onFormChange({ ...form, amountPaid: formatAmount(event.target.value) })}
                placeholder="0.00"
                aria-label="Cantidad abonada en dólares"
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-[13px] text-[#3D2D2E] outline-none"
              />
            </div>
          </Field>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={onClose} className="h-[52px] flex-1 rounded-xl border border-[#e7ebe7] text-sm font-semibold hover:bg-[#e7efe7] sm:h-11">Cancelar</button>
            <button type="submit" className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#3D2D2E] text-sm font-semibold text-white hover:bg-[#261a1b] sm:h-11"><Check size={16} /> {editing ? "Guardar cambios" : "Crear inscripción"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold">{label}</span>{children}</label>;
}

