import type { Student, StudentForm } from "../types/student";

export const STORAGE_KEY = "summer-school-students-v1";
export const WORKSHOPS = ["Arte", "Cocina", "Costura", "Boy Scout"];
export const PAYMENT_THRESHOLD = 3.5;

export function createEmptyStudentForm(): StudentForm {
  return {
    childName: "",
    gender: "",
    age: "",
    location: "",
    guardianName: "",
    enrolledBy: "",
    shirtSize: "",
    phoneNumber: "",
    multimediaAuthorized: false,
    amountPaid: "",
    workshop: WORKSHOPS[0]
  };
}

export function isPaymentComplete(amountPaid: string) {
  return getPaymentAmount(amountPaid) >= PAYMENT_THRESHOLD;
}

export function getPaymentAmount(amountPaid: string) {
  const amount = Number(amountPaid.replace(",", "."));
  return Number.isFinite(amount) ? amount : 0;
}

export function formatAmount(amountPaid: string) {
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

export function capitalizeWords(value: string) {
  return value.replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

export const initialStudents: Student[] = [
  { id: "1", childName: "Sofía Martínez", age: 8, location: "Centro", guardianName: "Carlos Martínez", enrolledBy: "Laura Pérez", shirtSize: "5-M", phoneNumber: "555-0101", multimediaAuthorized: true, amountPaid: "50", workshop: "Arte" },
  { id: "2", childName: "Mateo Hernández", age: 9, location: "Norte", guardianName: "Ana Hernández", enrolledBy: "Laura Pérez", shirtSize: "10-S", phoneNumber: "555-0102", multimediaAuthorized: true, amountPaid: "50", workshop: "Boy Scout" },
  { id: "3", childName: "Valentina López", age: 7, location: "Sur", guardianName: "José López", enrolledBy: "Marta Ruiz", shirtSize: "5-M", phoneNumber: "555-0103", multimediaAuthorized: false, amountPaid: "0", workshop: "Cocina" },
  { id: "4", childName: "Sebastián Rivera", age: 10, location: "Centro", guardianName: "María Rivera", enrolledBy: "Laura Pérez", shirtSize: "10-S", phoneNumber: "555-0104", multimediaAuthorized: true, amountPaid: "50", workshop: "Costura" },
  { id: "5", childName: "Isabella Flores", age: 8, location: "Este", guardianName: "Pedro Flores", enrolledBy: "Marta Ruiz", shirtSize: "5-M", phoneNumber: "555-0105", multimediaAuthorized: false, amountPaid: "0", workshop: "Cocina" },
  { id: "6", childName: "Diego Ramírez", age: 11, location: "Norte", guardianName: "Laura Ramírez", enrolledBy: "Laura Pérez", shirtSize: "10-S", phoneNumber: "555-0106", multimediaAuthorized: true, amountPaid: "50", workshop: "Boy Scout" },
  { id: "7", childName: "Camila Torres", age: 9, location: "Sur", guardianName: "Ricardo Torres", enrolledBy: "Marta Ruiz", shirtSize: "5-M", phoneNumber: "555-0107", multimediaAuthorized: true, amountPaid: "50", workshop: "Costura" },
  { id: "8", childName: "Daniel García", age: 7, location: "Oeste", guardianName: "Patricia García", enrolledBy: "Laura Pérez", shirtSize: "5-M", phoneNumber: "555-0108", multimediaAuthorized: false, amountPaid: "0", workshop: "Arte" },
  { id: "9", childName: "Luciana Cruz", age: 10, location: "Centro", guardianName: "Miguel Cruz", enrolledBy: "Marta Ruiz", shirtSize: "10-S", phoneNumber: "555-0109", multimediaAuthorized: true, amountPaid: "50", workshop: "Cocina" },
  { id: "10", childName: "Gabriel Reyes", age: 8, location: "Este", guardianName: "Elena Reyes", enrolledBy: "Laura Pérez", shirtSize: "5-M", phoneNumber: "555-0110", multimediaAuthorized: true, amountPaid: "50", workshop: "Costura" },
  { id: "11", childName: "Emma Aguilar", age: 6, location: "Norte", guardianName: "Francisco Aguilar", enrolledBy: "Marta Ruiz", shirtSize: "10-S", phoneNumber: "555-0111", multimediaAuthorized: false, amountPaid: "0", workshop: "Arte" },
  { id: "12", childName: "Nicolás Castro", age: 9, location: "Sur", guardianName: "Verónica Castro", enrolledBy: "Laura Pérez", shirtSize: "5-M", phoneNumber: "555-0112", multimediaAuthorized: true, amountPaid: "50", workshop: "Boy Scout" }
];
