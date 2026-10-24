import { ReactNode } from "react";
import { Metadata } from "next";
import { IoArrowBack, IoGameController } from "react-icons/io5";
import { GiPortal } from "react-icons/gi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pokédex - Next.js",
  description: "Explora el mundo Pokémon",
};

interface PokemonLayoutProps {
  children: ReactNode;
}

export default function PokemonLayout({ children }: PokemonLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br to-purple-900">
      <nav className="bg-black bg-opacity-30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/pokemon" className="text-white text-2xl font-bold hover:text-purple-500 transition">
            <IoGameController size={30} className="inline-block" /> Pokédex Next.js
          </Link>

          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/" className="flex items-center gap-1 text-gray-300 hover:text-purple-400 transition">
              <IoArrowBack /> Inicio
            </Link>
            <Link
              href="/rickandmorty"
              className="flex items-center gap-1 text-gray-300 hover:text-lime-400 transition"
            >
              <GiPortal /> Rick and Morty
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
