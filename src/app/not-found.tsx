import Link from "next/link";
import { IoGameController, IoHome } from "react-icons/io5";
import { GiPortal } from "react-icons/gi";
import { TbMapSearch } from "react-icons/tb";

// 404 global: se muestra para cualquier URL que no existe en la aplicación
export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-linear-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center p-8">
      <div className="animate-fade-up max-w-xl w-full text-center">
        <TbMapSearch size={84} className="mx-auto text-purple-400 animate-float" />
        <h1 className="text-8xl font-extrabold text-white mt-6 tracking-tight">404</h1>
        <p className="text-2xl font-bold text-gray-200 mt-2">Página no encontrada</p>
        <p className="text-gray-400 mt-3">
          La ruta que escribiste no existe. Revisa la URL o elige a dónde quieres ir.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 px-5 rounded-xl hover:bg-gray-200 hover:-translate-y-0.5 transition"
          >
            <IoHome /> Inicio
          </Link>
          <Link
            href="/pokemon"
            className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-purple-500 hover:-translate-y-0.5 transition"
          >
            <IoGameController /> Pokédex
          </Link>
          <Link
            href="/rickandmorty"
            className="flex items-center justify-center gap-2 bg-lime-400 text-black font-bold py-3 px-5 rounded-xl hover:bg-lime-300 hover:-translate-y-0.5 transition"
          >
            <GiPortal /> Rick and Morty
          </Link>
        </div>
      </div>
    </main>
  );
}
