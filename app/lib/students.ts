import type { StudentForm } from "../types/student";

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

export function hasTwoMatchingNameParts(firstName: string, secondName: string) {
  const firstParts = new Set(firstName.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean));
  const secondParts = new Set(secondName.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean));
  let matches = 0;

  for (const part of firstParts) {
    if (secondParts.has(part) && ++matches >= 2) return true;
  }

  return false;
}