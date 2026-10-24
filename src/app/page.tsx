import Link from "next/link";
import { IoGameController } from "react-icons/io5";
import { GiPortal } from "react-icons/gi";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-3">
          Lab 10 · Enrutamiento y Páginas
        </h1>
        <p className="text-gray-400 text-center mb-12">Next.js · App Router · SSG · ISR · CSR</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/pokemon"
            className="group bg-white/5 border border-white/10 rounded-2xl p-8 transition hover:bg-purple-900/40 hover:border-purple-400 hover:-translate-y-1"
          >
            <IoGameController size={48} className="text-purple-400" />
            <h2 className="text-2xl font-bold text-white mt-4">Pokédex</h2>
            <p className="text-gray-400 mt-2">
              Ejercicio 1: lista con ISR y detalle con SSG usando la PokeAPI.
            </p>
            <span className="inline-block text-purple-400 font-semibold mt-4 group-hover:translate-x-1 transition">
              Entrar →
            </span>
          </Link>

          <Link
            href="/rickandmorty"
            className="group bg-white/5 border border-white/10 rounded-2xl p-8 transition hover:bg-emerald-900/40 hover:border-lime-400 hover:-translate-y-1"
          >
            <GiPortal size={48} className="text-lime-400" />
            <h2 className="text-2xl font-bold text-white mt-4">Rick and Morty</h2>
            <p className="text-gray-400 mt-2">
              Tarea: lista en caché, búsqueda en tiempo real y detalle con ISR.
            </p>
            <span className="inline-block text-lime-400 font-semibold mt-4 group-hover:translate-x-1 transition">
              Entrar →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
