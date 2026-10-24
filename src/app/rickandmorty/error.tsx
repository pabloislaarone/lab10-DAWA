"use client";

import { useEffect } from "react";
import Link from "next/link";
import PortalVisual from "@/components/rickandmorty/PortalVisual";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RickAndMortyError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error en Rick and Morty:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6">
      <div className="grayscale opacity-70">
        <PortalVisual size="w-40 h-40" />
      </div>
      <h1 className="animate-fade-up font-rick text-5xl tracking-wide text-red-400 mt-8">
        El portal colapsó
      </h1>
      <p className="animate-fade-up text-gray-400 mt-3 max-w-md">No pudimos conectar con el multiverso.</p>
      <p className="animate-fade-up font-mono text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 mt-4">
        {error.message}
      </p>
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => reset()}
          className="bg-portal hover:bg-portal-light text-black font-rick text-xl tracking-widest py-3 px-8 rounded-full transition cursor-pointer"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="bg-white/10 hover:bg-white/20 border border-white/20 font-rick text-xl tracking-widest py-3 px-8 rounded-full transition"
        >
          Inicio
        </Link>
      </div>
    </div>
  );
}
