import Link from "next/link";
import { TbPokeballOff } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br to-purple-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <TbPokeballOff size={80} className="mx-auto text-purple-600" />
        <h1 className="text-6xl font-extrabold text-gray-800 mt-4">404</h1>
        <p className="text-2xl font-bold text-gray-700 mt-2">Pokémon no encontrado</p>
        <p className="text-gray-500 mt-2 mb-6">
          Parece que este Pokémon escapó de la Pokébola. La página que buscas no existe.
        </p>
        <Link
          href="/pokemon"
          className="inline-block bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          ← Volver al Pokédex
        </Link>
      </div>
    </div>
  );
}
