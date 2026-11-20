"use client";

import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { auth } from "../lib/firebase/config";
import { getAuthErrorMessage } from "../lib/firebase/auth-errors";
import LoginForm from "./login-form";

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  }
  return context;
}

export default function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: Unsubscribe | undefined;

    async function initializeAuth() {
      try {
        await setPersistence(auth, browserLocalPersistence);
        if (!active) return;

        unsubscribe = onAuthStateChanged(
          auth,
          (authenticatedUser) => {
            setUser(authenticatedUser);
            setLoading(false);
          },
          (error) => {
            console.error("Error al verificar la sesión:", error);
            setAuthError("No se pudo verificar la sesión. Recarga la página e inténtalo de nuevo.");
            setLoading(false);
          }
        );
      } catch (error) {
        if (!active) return;
        console.error("Error al inicializar la autenticación:", error);
        setAuthError(getAuthErrorMessage(error));
        setLoading(false);
      }
    }

    void initializeAuth();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  async function handleSignIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function handleSignOut() {
    await signOut(auth);
  }

  let content: ReactNode;
  if (loading) {
    content = (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="flex items-center gap-3 text-sm text-[#8b8080]" role="status">
          <LoaderCircle size={20} className="animate-spin text-[#3D2D2E]" />
          Verificando sesión...
        </div>
      </main>
    );
  } else if (authError) {
    content = (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="max-w-md rounded-xl border border-[#e8d4d4] bg-white p-5 text-center text-sm text-[#7c3434]" role="alert">
          {authError}
        </p>
      </main>
    );
  } else if (user) {
    content = children;
  } else {
    content = <LoginForm />;
  }

  return (
    <AuthContext.Provider value={{ user, signIn: handleSignIn, signOut: handleSignOut }}>
      {content}
    </AuthContext.Provider>
  );
}
