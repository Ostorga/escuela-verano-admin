export type Gender = "M" | "F";

export type Student = {
  id: string;
  childName: string;
  gender?: Gender;
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

export type StudentForm = {
  childName: string;
  gender: Gender | "";
  age: string;
  location: string;
  guardianName: string;
  enrolledBy: string;
  shirtSize: string;
  phoneNumber: string;
  multimediaAuthorized: boolean;
  amountPaid: string;
  workshop: string;
};
