"use client";

import { AlertTriangle, UserPlus, X } from "lucide-react";

type DuplicateEnrollmentModalProps = {
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DuplicateEnrollmentModal({
  studentName,
  onConfirm,
  onCancel
}: DuplicateEnrollmentModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#21191a]/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="duplicate-enrollment-title"
        aria-describedby="duplicate-enrollment-description"
        className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff4e5] text-[#a66b1e]">
              <AlertTriangle size={18} />
            </div>
            <h2 id="duplicate-enrollment-title" className="text-xl font-bold">Nombre ya inscrito</h2>
            <p id="duplicate-enrollment-description" className="mt-1 text-xs leading-relaxed text-[#918687]">
              Ya existe una inscripción con el nombre completo <span className="font-semibold text-[#3D2D2E]">{studentName}</span>. ¿Deseas inscribirlo de todos modos?
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-[#8e8384] hover:bg-[#e6ece6]"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            className="h-11 flex-1 rounded-xl border border-[#e7ebe7] text-sm font-semibold hover:bg-[#e7efe7]"
          >
            No inscribir
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#3D2D2E] text-sm font-semibold text-white hover:bg-[#261a1b]"
          >
            <UserPlus size={16} /> Inscribir de todos modos
          </button>
        </div>
      </div>
    </div>
  );
}
