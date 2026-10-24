import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Bangers } from "next/font/google";
import { GiPortal } from "react-icons/gi";
import PortalBackground from "@/components/rickandmorty/PortalBackground";

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rick and Morty · Multiverso",
  description: "Explora los personajes del multiverso de Rick and Morty",
};

interface RickAndMortyLayoutProps {
  children: ReactNode;
}

export default function RickAndMortyLayout({ children }: RickAndMortyLayoutProps) {
  return (
    <div
      className={`${bangers.variable} relative isolate min-h-screen bg-[#04060b] text-white selection:bg-portal selection:text-black`}
    >
      <PortalBackground />

      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-portal/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/rickandmorty" className="group flex items-center gap-2">
            <GiPortal
              size={38}
              className="text-portal animate-portal-spin drop-shadow-[0_0_10px_rgb(151_206_76/0.8)]"
            />
            <span className="font-rick text-2xl md:text-3xl tracking-wider text-white group-hover:text-portal-light transition">
              Rick <span className="text-portal">&amp;</span> Morty
            </span>
          </Link>

          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/" className="text-gray-400 hover:text-portal-light transition">
              Inicio
            </Link>
            <Link href="/pokemon" className="text-gray-400 hover:text-portal-light transition">
              Pokédex
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">{children}</main>

      <footer className="relative border-t border-white/10 mt-16 py-6 text-center text-xs text-gray-500">
        Datos de <span className="text-portal">rickandmortyapi.com</span> · Lab 10 · Next.js App Router
      </footer>
    </div>
  );
}
