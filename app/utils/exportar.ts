"use client";

import type { Student } from "../types/student";

const HEADERS = [
  "Nombre del alumno",
  "Edad",
  "Ubicación",
  "Taller",
  "Monto pagado",
  "Encargado",
  "Inscrito por",
  "Talla",
  "Número telefónico",
  "Autorización de multimedia",
] as const;

function value(value: string | number | null | undefined) {
  return value === null || value === undefined || value === "" ? "-" : String(value);
}

function rows(students: Student[]) {
  return students.map((student) => [
    value(student.childName),
    value(student.age),
    value(student.location),
    value(student.workshop),
    `$${value(student.amountPaid === "" ? "0.00" : student.amountPaid)}`,
    value(student.guardianName),
    value(student.enrolledBy),
    value(student.shirtSize),
    value(student.phoneNumber),
    student.multimediaAuthorized ? "Autorizada" : "No autorizada",
  ]);
}

/** Genera una tabla PDF en el navegador. Las importaciones dinámicas evitan SSR. */
export async function exportarPDF(students: Student[]) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });
  const generatedAt = new Intl.DateTimeFormat("es-SV", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date());

  document.setFontSize(18);
  document.setTextColor(61, 45, 46);
  document.text("Inscripciones — Escuela de Verano 2026", 14, 16);
  document.setFontSize(9);
  document.setTextColor(100, 100, 100);
  document.text(`Generado: ${generatedAt}  |  Registros: ${students.length}`, 14, 23);

  autoTable(document, {
    head: [[...HEADERS]],
    body: rows(students),
    startY: 29,
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 2, valign: "middle", overflow: "linebreak" },
    headStyles: { fillColor: [61, 45, 46], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 248, 245] },
    margin: { left: 10, right: 10, bottom: 14 },
    didDrawPage: () => {
      const pageCount = document.getNumberOfPages();
      document.setFontSize(8);
      document.setTextColor(100);
      document.text(`Página ${pageCount}`, document.internal.pageSize.getWidth() - 24, document.internal.pageSize.getHeight() - 7);
    },
  });

  document.save("inscripciones-escuela-verano.pdf");
}

/** Genera un libro Excel .xlsx con columnas independientes y anchos legibles. */
export async function exportarExcel(students: Student[]) {
  const XLSX = await import("xlsx");
  const data = [Array.from(HEADERS), ...rows(students)];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  worksheet["!cols"] = HEADERS.map((header, columnIndex) => ({
    wch: Math.min(42, Math.max(header.length + 2, ...data.map((row) => String(row[columnIndex] ?? "").length + 2))),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inscripciones");
  XLSX.writeFile(workbook, "inscripciones-escuela-verano.xlsx", { compression: true });
}
