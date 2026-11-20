
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "./config";
import type { Student } from "../../types/student";

const studentsCollection = collection(db, "students");

export function subscribeStudents(
  onUpdate: (students: Student[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    studentsCollection,
    (snapshot) => {
      const students = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      })) as Student[];

      onUpdate(students);
    },
    onError
  );
}

export async function createStudent(student: Omit<Student, "id">) {
  const result = await addDoc(studentsCollection, student);
  return result.id;
}

export async function updateStudent(
  id: string,
  student: Partial<Omit<Student, "id">>
) {
  await updateDoc(doc(db, "students", id), student);
}

export async function deleteStudent(id: string) {
  await deleteDoc(doc(db, "students", id));
}
