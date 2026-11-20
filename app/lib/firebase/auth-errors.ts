import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Ocurrió un error inesperado. Inténtalo de nuevo.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "El correo electrónico no tiene un formato válido.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "El correo electrónico o la contraseña son incorrectos.";
    case "auth/user-disabled":
      return "Esta cuenta está deshabilitada. Contacta al administrador.";
    case "auth/too-many-requests":
      return "Hubo demasiados intentos. Espera un momento e inténtalo de nuevo.";
    case "auth/network-request-failed":
      return "No se pudo conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.";
    default:
      return "No se pudo completar la autenticación. Inténtalo de nuevo.";
  }
}
