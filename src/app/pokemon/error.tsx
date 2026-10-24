"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error en Pokédex:", error);
  }, [error]);

  return (
    <div className="p-8 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <MdErrorOutline size={72} className="mx-auto text-red-500" />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">¡Algo salió mal!</h1>
        <p className="text-gray-500 mt-2">No pudimos cargar la información de la Pokédex.</p>
        <p className="text-sm text-red-400 bg-red-50 rounded-lg p-3 font-mono my-6">{error.message}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition cursor-pointer"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
