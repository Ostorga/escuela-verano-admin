import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import AuthProvider from "./components/auth-provider";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Escuela de Verano | Administración",
  description: "Panel administrativo de inscripciones de la escuela de verano.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={instrumentSans.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
