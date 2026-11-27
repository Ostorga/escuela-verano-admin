
"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import DeleteConfirmationModal from "./components/delete-confirmation-modal";
import DuplicateEnrollmentModal from "./components/duplicate-enrollment-modal";
import EnrollmentModal from "./components/enrollment-modal";
import Navbar from "./components/navbar";
import Pagination from "./components/pagination";
import Sidebar from "./components/sidebar";
import StudentsTable from "./components/students-table";
import SummaryCards from "./components/summary-cards";
import {
  createEmptyStudentForm,
  formatAmount,
  getPaymentAmount,
  hasTwoMatchingNameParts,
  isPaymentComplete,
  PAYMENT_THRESHOLD,
  WORKSHOPS,
} from "./lib/students";
import {
  createStudent,
  deleteStudent as deleteStudentFromFirebase,
  subscribeStudents,
  updateStudent,
} from "./lib/firebase/students";
import type { Student, StudentForm } from "./types/student";

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [ready, setReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [duplicateStudentName, setDuplicateStudentName] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState<StudentForm>(createEmptyStudentForm);

  useEffect(() => {
    const unsubscribe = subscribeStudents(
      (studentsFromFirebase) => {
        setStudents(studentsFromFirebase);
        setReady(true);
        setFirebaseError(null);
      },
      (error) => {
        console.error("Error al obtener estudiantes:", error);
        setFirebaseError("No se pudieron cargar los estudiantes.");
        setReady(true);
      }
    );

    return () => unsubscribe();
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
  const maleCount = students.filter((student) => student.gender === "M").length;
  const femaleCount = students.filter((student) => student.gender === "F").length;
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
    setForm(createEmptyStudentForm());
    setModalOpen(true);
  }

  function openEdit(student: Student) {
    setEditing(student);
    setForm({
      childName: student.childName,
      gender: student.gender ?? "",
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
    setModalOpen(true);
  }

  async function saveStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveStudentData(false);
  }

  async function saveStudentData(allowDuplicate: boolean) {
    const childName = form.childName.trim();
    const location = form.location.trim();
    const guardianName = form.guardianName.trim();
    const enrolledBy = form.enrolledBy.trim();
    const shirtSize = form.shirtSize.trim();
    const phoneNumber = form.phoneNumber.replace(/\D/g, "").slice(0, 8);
    const gender = form.gender;

    if (
      !childName ||
      (gender !== "M" && gender !== "F") ||
      !location ||
      !guardianName ||
      !enrolledBy ||
      !shirtSize ||
      !phoneNumber ||
      form.age === ""
    ) {
      return false;
    }

    if (!editing && !allowDuplicate) {
      const duplicate = students.find(
        (student) => hasTwoMatchingNameParts(student.childName, childName)
      );
      if (duplicate) {
        setDuplicateStudentName(duplicate.childName);
        return false;
      }
    }

    const studentData = {
      ...form,
      gender,
      childName,
      age: Number(form.age),
      location,
      guardianName,
      enrolledBy,
      shirtSize,
      phoneNumber,
      amountPaid: formatAmount(form.amountPaid),
    };

    try {
      if (editing) {
        await updateStudent(editing.id, studentData);
      } else {
        await createStudent(studentData);
        setPage(1);
      }

      setModalOpen(false);
      setDuplicateStudentName(null);
      return true;
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
      window.alert("No se pudo guardar la inscripción en Firebase.");
      return false;
    }
  }

  async function confirmDuplicateEnrollment() {
    await saveStudentData(true);
  }

function deleteStudent(student: Student) {
  setStudentToDelete(student);
}

async function confirmDeleteStudent() {
  if (!studentToDelete || deleting) return;

  setDeleting(true);
  try {
    await deleteStudentFromFirebase(studentToDelete.id);
    setExpandedStudentId((current) =>
      current === studentToDelete.id ? null : current
    );
    setStudentToDelete(null);
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
    window.alert("No se pudo eliminar la inscripción de Firebase.");
  } finally {
    setDeleting(false);
  }
}

  return (
    <div className="min-h-screen">
      <Navbar onToggleMenu={() => setMobileNav(!mobileNav)} />

      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar
          mobileNav={mobileNav}
          sidebarCollapsed={sidebarCollapsed}
          studentCount={students.length}
          onCloseMobileNav={() => setMobileNav(false)}
          onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-6 lg:py-10 xl:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-medium text-[#8d8182]"><CalendarDays size={14} /> ESCUELA DE VERANO / 2026</p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">Inscripciones</h1>
                <p className="mt-2 text-sm text-[#8b8080]">Gestiona los niños inscritos y el estado de sus pagos.</p>
              </div>
              <button onClick={openCreate} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3D2D2E] px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(61,45,46,0.22)] transition hover:bg-[#261a1b]">
                <Plus size={17} /> Nueva inscripción
              </button>
            </div>

            <SummaryCards
              studentCount={students.length}
              maleCount={maleCount}
              femaleCount={femaleCount}
              paid={paidCount}
              partial={partialPaymentCount}
              none={noPaymentCount}
              sizes={shirtSizeCounts}
              workshops={workshopCounts}
            />

            <section className="overflow-visible rounded-2xl border border-[#dfe5df] bg-white shadow-[0_8px_30px_rgba(45,65,45,0.09)]">
              <StudentsTable
                students={visibleStudents}
                exportStudents={filtered}
                filteredCount={filtered.length}
                search={search}
                paymentFilter={paymentFilter}
                expandedStudentId={expandedStudentId}
                onSearchChange={setSearch}
                onPaymentFilterChange={setPaymentFilter}
                onToggleExpanded={(studentId) => setExpandedStudentId((current) => current === studentId ? null : studentId)}
                onEdit={openEdit}
                onDelete={deleteStudent}
              />
              <Pagination page={page} totalPages={totalPages} totalCount={filtered.length} onPageChange={setPage} />
            </section>

            <p className="mt-5 text-center text-[11px] text-[#aaa1a1]">
              {firebaseError
                ? firebaseError
                : !ready
                  ? "Cargando estudiantes..."
                  : "Datos sincronizados con Firebase en tiempo real."}
            </p>
          </div>
        </main>
      </div>

      {modalOpen && !duplicateStudentName && (
        <EnrollmentModal
          form={form}
          editing={editing}
          onFormChange={setForm}
          onSubmit={saveStudent}
          onClose={() => setModalOpen(false)}
        />
      )}
      {modalOpen && duplicateStudentName && (
        <DuplicateEnrollmentModal
          studentName={duplicateStudentName}
          onConfirm={confirmDuplicateEnrollment}
          onCancel={() => {
            setDuplicateStudentName(null);
            setModalOpen(false);
          }}
        />
      )}
      {studentToDelete && (
        <DeleteConfirmationModal
          student={studentToDelete}
          deleting={deleting}
          onConfirm={confirmDeleteStudent}
          onClose={() => {
            if (!deleting) setStudentToDelete(null);
          }}
        />
      )}
    </div>
  );
}
