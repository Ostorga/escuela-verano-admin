"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import type { Student } from "../types/student";

type DeleteConfirmationModalProps = {
  student: Student;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteConfirmationModal({
  student,
  deleting,
  onConfirm,
  onClose
}: DeleteConfirmationModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#21191a]/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (!deleting && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffdddd] text-[#c34d4d]">
              <AlertTriangle size={18} />
            </div>
            <h2 id="delete-confirmation-title" className="text-xl font-bold">Eliminar inscripción</h2>
            <p id="delete-confirmation-description" className="mt-1 text-xs text-[#918687]">
              ¿Estás seguro de que deseas eliminar la inscripción de <span className="font-semibold text-[#3D2D2E]">{student.childName}</span>? Esta acción no se puede deshacer.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg p-2 text-[#8e8384] hover:bg-[#e6ece6] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            autoFocus
            className="h-11 flex-1 rounded-xl border border-[#e7ebe7] text-sm font-semibold hover:bg-[#e7efe7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#c34d4d] text-sm font-semibold text-white hover:bg-[#a93d3d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} /> {deleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
