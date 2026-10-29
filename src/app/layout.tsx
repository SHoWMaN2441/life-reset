import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Reset 66 — Shaxsiy Transformatsiya va Intizom Tizimi",
  description: "66 kunlik ilmiy asoslangan intizom, AI kaloriya hisoblagich, 6 burchakli radar diagrammasi va tana transformatsiyasi dasturi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white font-sans selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
