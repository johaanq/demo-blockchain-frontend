import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Voto Digital ONPE — EG Perú 2026 (demo)",
  description:
    "Prototipo académico de sufragio en línea con verificación de DNI, padrón electoral y trazabilidad blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sans.variable} h-full`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
